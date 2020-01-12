export class UserAuthData {
    private email: string;
    private licenseKey: string;
    private isActivated: boolean;

    constructor() {
        this.email = '';
        this.licenseKey = '';
        this.isActivated = false;
    }

    getEmail = (): string => {
        return this.email;
    };

    getLicenseKey = (): string => {
        return this.licenseKey;
    };

    getIsActivated = (): boolean => {
        return this.isActivated;
    };

    setEmail = (email: string): void => {
        this.email = email;
    };

    setLicenseKey = (licenseKey: string): void => {
        this.licenseKey = licenseKey;
    };

    setIsActivated = (isActivated: boolean): void => {
        this.isActivated = isActivated;
    };

    clearUserAuthData = (): void => {
        this.email = '';
        this.licenseKey = '';
        this.isActivated = false;
    };

    setAll = (email: string, licenseKey: string, isActivated: boolean): void => {
        this.email = email;
        this.licenseKey = licenseKey;
        this.isActivated = isActivated;
    };
}

export const enum LicenseType {
    Lifetime = 'LIFETIME',
    Renewal = 'RENEWAL',
    Beta = 'BETA',
    Rental = 'RENTAL',
}
