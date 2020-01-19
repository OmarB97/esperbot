<template>
    <div class="flex flex-col items-center justify-center">
        <p class="block text-gray-400 text-sm font-semibold mb-2 mt-4">
            Authentication failed, please try again.
        </p>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <p class="block text-gray-400 text-sm italic mb-2 mt-4">Reason: {{ authErrMsg }}</p>
        <auth-form form-type="authenticate" @authenticate="authenticateLicense"></auth-form>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import store from '@/store';
import { firestore } from 'firebase';
import { AUTH_ERROR_CODE } from '@/data/models/user_auth_data';
import { TheMask } from 'vue-the-mask';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import '../utils/validation';
import AuthForm from '../components/AuthForm.vue';

@Component({
    components: {
        TheMask,
        ValidationProvider,
        ValidationObserver,
        AuthForm,
    },
})
export default class Authenticate extends Vue {
    @Prop(Number) authErr!: AUTH_ERROR_CODE;

    authErrVal: AUTH_ERROR_CODE = this.authErr;

    // computed
    get authErrMsg(): string {
        // switch statement on authErr to determine which error message to display
        switch (this.authErrVal) {
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

    async authenticateLicense(formData: { email: string; licenseKey: string }): Promise<void> {
        await store.dispatch('authenticate', formData).then(res => {
            if (res.res && store.state.isAuthenticated) {
                this.$router.push({ path: 'home' });
            } else {
                this.authErrVal = res.err;
            }
        });
    }
}
</script>

<style scoped lang="scss"></style>
