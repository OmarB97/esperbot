<template>
    <div class>
        <h6>You need to re-authenticate.</h6>
        <h6>Error: {{ authErrMsg }}</h6>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { AUTH_ERROR_CODE } from '@/data/models/user_auth_data';
import { firestore } from 'firebase';
import store from '@/store';

@Component
export default class Authenticate extends Vue {
    @Prop(Number) readonly authErr!: AUTH_ERROR_CODE;

    // computed
    get authErrMsg(): string {
        // switch statement on authErr to determine which error message to display
        switch (this.authErr) {
            case AUTH_ERROR_CODE.INVALID_EMAIL:
                return 'The email address provided does not match our records.';
            case AUTH_ERROR_CODE.INVALID_KEY:
                return 'Please enter a valid license key.';
            case AUTH_ERROR_CODE.NOT_ACTIVE:
                return 'Your license key is not yet activated.';
            case AUTH_ERROR_CODE.INVALID_MACHINE_ID:
                return 'This license key is already activated on another device.';
            case AUTH_ERROR_CODE.RENTING:
                const rentalExpirationDate: string = (store.state.authData[
                    'rentalExpirationDate'
                ] as firestore.Timestamp)
                    .toDate()
                    .toDateString();
                return `This license is currently being rented until ${rentalExpirationDate}.`;
            case AUTH_ERROR_CODE.EXPIRED_RENEWAL_KEY: {
                const licenseExpirationDate: string = (store.state.authData[
                    'licenseExpirationDate'
                ] as firestore.Timestamp)
                    .toDate()
                    .toDateString();
                return `This renewal license expired on ${licenseExpirationDate}. Please visit www.esperbot.io/renew to renew your license.`;
            }
            case AUTH_ERROR_CODE.EXPIRED_RENTAL_KEY: {
                const licenseExpirationDate: string = (store.state.authData[
                    'licenseExpirationDate'
                ] as firestore.Timestamp)
                    .toDate()
                    .toDateString();
                return `This rental license expired on ${licenseExpirationDate}.`;
            }
            case AUTH_ERROR_CODE.INVALID_LICENSE_TYPE:
                return 'This license is under an invalid license type.';
            case AUTH_ERROR_CODE.UNKNOWN:
                return 'An unknown error occurred while trying to authenticate.';
            default:
                return 'No error message provided.';
        }
    }
}
</script>

<style scoped lang="scss"></style>
