import { UserData, LicenseType } from '@/data/models/user_data';
import { firestore } from 'firebase';
import { machineIdSync } from 'node-machine-id';

export default class ValidateAuth {
    static validateUser(
        userData: UserData,
        docRef: firestore.DocumentReference,
        firestoreData: firestore.DocumentData,
    ): boolean {
        const localEmail: string = userData.getEmail();
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
        const licenseExpirationDate: number = (firestoreData[
            'licenseExpirationDate'
        ] as firestore.Timestamp).toMillis();
        if (Date.now() >= licenseExpirationDate) {
            return false;
        }
        return true;
    }

    private static isRentalValid(docRef: firestore.DocumentReference, firestoreData: firestore.DocumentData): boolean {
        // check licenseExpirationDate
        const licenseExpirationDate: number = (firestoreData[
            'licenseExpirationDate'
        ] as firestore.Timestamp).toMillis();
        if (Date.now() >= licenseExpirationDate) {
            docRef.delete();
            return false;
        }
        return true;
    }
}
