import ElectronStore from 'electron-store';
import { UserData } from '@/data/models/user_auth_data';

export class DataStore {
    private store = new ElectronStore();
    userData: UserData;
    constructor() {
        // Intialize with userData or empty object
        this.userData = this.store.get('userData') || new UserData();
    }

    saveUserData(): DataStore {
        // Save userData to JSON file
        this.store.set('userData', this.userData);

        // Returning "this" allows method chaining
        return this;
    }

    getUserData(): DataStore {
        // Set object's userData to userData in JSON file
        this.userData = this.store.get('userData') || this.userData;
        return this;
    }

    addUserData(email: string, licenseKey: string, isActivated: boolean): DataStore {
        this.userData.setAll(email, licenseKey, isActivated);
        return this.saveUserData();
    }

    deleteUserData(): DataStore {
        this.userData.clearUserData();
        return this.saveUserData();
    }

    updateUserData(email?: string, licenseKey?: string, isActivated?: boolean): DataStore {
        if (email !== undefined) {
            this.userData.setEmail(email);
        }

        if (licenseKey !== undefined) {
            this.userData.setLicenseKey(licenseKey);
        }

        if (isActivated !== undefined) {
            this.userData.setIsActivated(isActivated);
        }

        return this.saveUserData();
    }
}
