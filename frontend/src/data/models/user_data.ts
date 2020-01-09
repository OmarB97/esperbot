export class UserData {
    private firstName: string;
    private lastName: string;
    private email: string;
    private licenseKey: string;
    private isActivated: boolean;

    constructor() {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.licenseKey = '';
        this.isActivated = false;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getLastName(): string {
        return this.lastName;
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

    setFirstName(firstName: string) {
        this.firstName = firstName;
    }

    setLastName(lastName: string) {
        this.lastName = lastName;
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
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.licenseKey = '';
        this.isActivated = false;
    }

    setAll(firstName: string, lastName: string, email: string, licenseKey: string, isActivated: boolean) {
        this.firstName = firstName;
        this.lastName = lastName;
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
