export class UserData {
    private email: string;
    private licenseKey: string;
    private isActivated: boolean;

    constructor() {
        this.email = '';
        this.licenseKey = '';
        this.isActivated = false;
    }

    getEmail(): string {
        return this.email;
    }

    getLicenseKey(): string {
        return this.licenseKey;
    }

    getIsActivated(): boolean {
        return this.isActivated;
    }

    setEmail(email: string) {
        this.email = email;
    }

    setLicenseKey(licenseKey: string) {
        this.licenseKey = licenseKey;
    }

    setIsActivated(isActivated: boolean) {
        this.isActivated = isActivated;
    }

    clearUserData() {
        this.email = '';
        this.licenseKey = '';
        this.isActivated = false;
    }

    setAll(email: string, licenseKey: string, isActivated: boolean) {
        this.email = email;
        this.licenseKey = licenseKey;
        this.isActivated = isActivated;
    }
}

export const enum LicenseType {
    Lifetime = 'LIFETIME',
    Renewal = 'RENEWAL',
    Beta = 'BETA',
    Rental = 'RENTAL',
}
