import ElectronStore from 'electron-store';
import { UserAuthData } from '@/data/models/user_auth_data';

export class DataStore {
    private store = new ElectronStore();
    userAuthData: UserAuthData;
    constructor() {
        this.userAuthData = new UserAuthData();
        // Intialize with userAuthData or empty object
        if (this.store.has('userAuthData')) {
            const data = this.store.get('userAuthData');
            this.userAuthData.setAll(data.email, data.licenseKey, data.isActivated);
        }
    }

    saveUserAuthData = (): DataStore => {
        // Save userAuthData to JSON file
        this.store.set('userAuthData', this.userAuthData);

        // Returning "this" allows method chaining
        return this;
    };

    addUserAuthData = (email: string, licenseKey: string, isActivated: boolean): DataStore => {
        this.userAuthData.setAll(email, licenseKey, isActivated);
        return this.saveUserAuthData();
    };

    deleteUserAuthData = (): DataStore => {
        this.userAuthData.clearUserAuthData();
        return this.saveUserAuthData();
    };

    updateUserAuthData = (email?: string, licenseKey?: string, isActivated?: boolean): DataStore => {
        if (email !== undefined) {
            this.userAuthData.setEmail(email);
        }

        if (licenseKey !== undefined) {
            this.userAuthData.setLicenseKey(licenseKey);
        }

        if (isActivated !== undefined) {
            this.userAuthData.setIsActivated(isActivated);
        }

        return this.saveUserAuthData();
    };

    getEmail = (): string => {
        return this.userAuthData.getEmail();
    };

    getLicenseKey = (): string => {
        return this.userAuthData.getLicenseKey();
    };

    getIsActivated = (): boolean => {
        return this.userAuthData.getIsActivated();
    };
}
