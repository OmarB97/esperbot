import { LicenseType } from '@/data/models/user_auth_data';
import { firestore } from 'firebase';
import { DB, Timestamp } from '@/firebase/db';
import { machineIdSync } from 'node-machine-id';
import { DataStore } from '@/storage/datastore';

export default class ValidateAuth {
    static async activateUser(dataStore: DataStore, formData): Promise<boolean> {
        const docRef: firestore.DocumentReference = DB.collection('users').doc(formData.licenseKey);
        const res = await docRef.get().then(doc => {
            if (doc.exists) {
                const docData = doc.data() as firestore.DocumentData;
                if (formData.email !== docData['email']) {
                    return false;
                }

                const activationDBData = {
                    isActive: true,
                    deviceId: machineIdSync(),
                    licenseActivationDate: Timestamp.fromMillis(Date.now()),
                };

                const licenseType = docData['licenseType'];
                if (licenseType === LicenseType.Renewal) {
                    const licenseExpirationDate = new Date();
                    licenseExpirationDate.setDate(licenseExpirationDate.getDate() + 30); // expires 30 days after activation date
                    Object.assign(activationDBData, {
                        licenseExpirationDate: Timestamp.fromDate(licenseExpirationDate),
                    });
                }
                const updateRes = docRef
                    .update(activationDBData)
                    .then(() => {
                        dataStore.addUserAuthData(formData.email, formData.licenseKey, true);
                        Object.assign(docData, activationDBData);
                        if (this.validateUser(dataStore, docRef, docData)) {
                            return true;
                        } else {
                            return false;
                        }
                    })
                    .catch(err => {
                        return false;
                    });
                return updateRes;
            } else {
                return false;
            }
        });
        return res;
    }

    static async authenticateUser(dataStore: DataStore): Promise<boolean> {
        const docRef: firestore.DocumentReference = DB.collection('users').doc(dataStore.getLicenseKey());
        const res = await docRef.get().then(doc => {
            if (doc.exists) {
                const docData = doc.data() as firestore.DocumentData;
                if (this.validateUser(dataStore, docRef, docData)) {
                    return true;
                }
            }
            return false;
        });
        return res;
    }

    private static validateUser(
        dataStore: DataStore,
        docRef: firestore.DocumentReference,
        firestoreData: firestore.DocumentData,
    ): boolean {
        const localEmail: string = dataStore.getEmail();
        const firestoreEmail: string = firestoreData['email'];

        if (localEmail !== firestoreEmail) {
            return false;
        }

        // check isActive
        const isActive: boolean = firestoreData['isActive'];
        if (!isActive) {
            return false;
        }

        // Check deviceId to make sure only one device is using license key
        const deviceId: string = firestoreData['deviceId'];
        if (deviceId !== machineIdSync()) {
            return false;
        }

        // check isRenting
        if (this.isRenting(docRef, firestoreData)) {
            return false;
        }

        // check licenseType
        const licenseType: string = firestoreData['licenseType'];
        switch (licenseType) {
            case LicenseType.Lifetime:
                // Do nothing, we already check isActive and isRenting above
                break;
            case LicenseType.Renewal:
                if (!this.isRenewalValid(firestoreData)) {
                    return false;
                }
                break;
            case LicenseType.Beta:
                // Do nothing, we already check isActive and isRenting above
                break;
            case LicenseType.Rental:
                if (!this.isRentalValid(docRef, firestoreData)) {
                    return false;
                }
                break;
            default:
                return false;
        }

        return true;
    }

    private static isRenting(docRef: firestore.DocumentReference, firestoreData: firestore.DocumentData): boolean {
        const isRenting: boolean = firestoreData['isRenting'];
        if (isRenting) {
            /*
                Check renting expiration date.
                If passed, then set isRenting to true continue validating.
            */
            const rentalExpirationMs: number = (firestoreData[
                'rentalExpirationDate'
            ] as firestore.Timestamp).toMillis();
            if (Date.now() < rentalExpirationMs) {
                return true;
            } else {
                /*
                    Remove the 'rentalExpirationDate' field from the document.
                    Update the 'isRenting' field to false.
                */
                docRef.update({
                    rentalExpirationDate: firestore.FieldValue.delete(),
                    isRenting: false,
                });
                return false;
            }
        }
        return false;
    }

    private static isRenewalValid(firestoreData: firestore.DocumentData): boolean {
        // check licenseExpirationDate
        const licenseExpirationDateMs: number = (firestoreData[
            'licenseExpirationDate'
        ] as firestore.Timestamp).toMillis();

        if (Date.now() >= licenseExpirationDateMs) {
            return false;
        }
        return true;
    }

    private static isRentalValid(docRef: firestore.DocumentReference, firestoreData: firestore.DocumentData): boolean {
        // check licenseExpirationDate
        const licenseExpirationDateMs: number = (firestoreData[
            'licenseExpirationDate'
        ] as firestore.Timestamp).toMillis();

        if (Date.now() >= licenseExpirationDateMs) {
            docRef.delete();
            return false;
        }
        return true;
    }
}
