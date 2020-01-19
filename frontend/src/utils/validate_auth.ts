import { LicenseType, AUTH_ERROR_CODE } from '@/data/models/user_auth_data';
import { firestore } from 'firebase';
import { DB, Timestamp } from '@/firebase/db';
import { machineIdSync } from 'node-machine-id';
import { DataStore } from '@/storage/datastore';

export default class ValidateAuth {
    static async activateUser(
        dataStore: DataStore,
        formData: { email: string; licenseKey: string },
    ): Promise<{ res: boolean; err: AUTH_ERROR_CODE; data: firestore.DocumentData }> {
        const docRef: firestore.DocumentReference = DB.collection('users').doc(formData.licenseKey);
        const res = await docRef.get().then(doc => {
            if (doc.exists) {
                const docData = doc.data() as firestore.DocumentData;
                if (formData.email !== docData['email']) {
                    return {
                        res: false,
                        err: AUTH_ERROR_CODE.INVALID_EMAIL,
                        data: docData,
                    };
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
                        return this.validateUser(dataStore, docRef, docData);
                    })
                    .catch(() => {
                        return {
                            res: false,
                            err: AUTH_ERROR_CODE.UNKNOWN,
                            data: docData,
                        };
                    });
                return updateRes;
            }
            return {
                res: false,
                err: AUTH_ERROR_CODE.INVALID_KEY,
                data: {},
            };
        });
        return res;
    }

    static async authenticateUser(
        dataStore: DataStore,
    ): Promise<{ res: boolean; err: AUTH_ERROR_CODE; data: firestore.DocumentData }> {
        if (!dataStore.getIsActivated()) {
            return {
                res: false,
                err: AUTH_ERROR_CODE.NOT_ACTIVE,
                data: {},
            };
        }
        const docRef: firestore.DocumentReference = DB.collection('users').doc(dataStore.getLicenseKey());
        const res = await docRef.get().then(doc => {
            if (doc.exists) {
                const docData = doc.data() as firestore.DocumentData;
                return this.validateUser(dataStore, docRef, docData);
            }
            return {
                res: false,
                err: AUTH_ERROR_CODE.INVALID_KEY,
                data: {},
            };
        });
        return res;
    }

    private static validateUser(
        dataStore: DataStore,
        docRef: firestore.DocumentReference,
        firestoreData: firestore.DocumentData,
    ): { res: boolean; err: AUTH_ERROR_CODE; data: firestore.DocumentData } {
        const localEmail: string = dataStore.getEmail();
        const firestoreEmail: string = firestoreData['email'];
        if (localEmail !== firestoreEmail) {
            return {
                res: false,
                err: AUTH_ERROR_CODE.INVALID_EMAIL,
                data: firestoreData,
            };
        }
        const isActive: boolean = firestoreData['isActive'];
        if (!isActive) {
            return {
                res: false,
                err: AUTH_ERROR_CODE.NOT_ACTIVE,
                data: firestoreData,
            };
        }
        // Check deviceId to make sure only one device is using license key
        const deviceId: string = firestoreData['deviceId'];
        if (deviceId !== machineIdSync()) {
            return {
                res: false,
                err: AUTH_ERROR_CODE.INVALID_MACHINE_ID,
                data: firestoreData,
            };
        }
        if (this.isRenting(docRef, firestoreData)) {
            return {
                res: false,
                err: AUTH_ERROR_CODE.RENTING,
                data: firestoreData,
            };
        }
        // check licenseType
        const licenseType: string = firestoreData['licenseType'];
        switch (licenseType) {
            case LicenseType.Lifetime:
                // Do nothing, we already check isActive and isRenting above
                break;
            case LicenseType.Renewal:
                if (!this.isRenewalValid(firestoreData)) {
                    return {
                        res: false,
                        err: AUTH_ERROR_CODE.EXPIRED_RENEWAL_KEY,
                        data: firestoreData,
                    };
                }
                break;
            case LicenseType.Beta:
                // Do nothing, same as Lifetime
                break;
            case LicenseType.Rental:
                if (!this.isRentalValid(docRef, firestoreData)) {
                    return {
                        res: false,
                        err: AUTH_ERROR_CODE.EXPIRED_RENTAL_KEY,
                        data: firestoreData,
                    };
                }
                break;
            default:
                return {
                    res: false,
                    err: AUTH_ERROR_CODE.INVALID_LICENSE_TYPE,
                    data: firestoreData,
                };
        }
        return {
            res: true,
            err: AUTH_ERROR_CODE.NO_ERROR,
            data: firestoreData,
        };
    }

    private static isRenting(docRef: firestore.DocumentReference, firestoreData: firestore.DocumentData): boolean {
        const isRenting: boolean = firestoreData['isRenting'];
        if (isRenting) {
            /*
                Check renting expiration date.
            */
            const rentalExpirationMs: number = (firestoreData[
                'rentalExpirationDate'
            ] as firestore.Timestamp).toMillis();
            if (Date.now() < rentalExpirationMs) {
                return true;
            } else {
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
        /*
            Check renewal license expiration date.
        */
        const licenseExpirationDateMs: number = (firestoreData[
            'licenseExpirationDate'
        ] as firestore.Timestamp).toMillis();
        if (Date.now() >= licenseExpirationDateMs) {
            return false;
        }
        return true;
    }

    private static isRentalValid(docRef: firestore.DocumentReference, firestoreData: firestore.DocumentData): boolean {
        /*
            Check rental license expiration date.
        */
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
