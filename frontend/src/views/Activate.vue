<template>
    <div>
        <div class="flex-row w-full content-center mb-6">
            <p class="text-blue-500 text-center font-semibold text-2xl font-sans">
                Welcome to Esperbot!
            </p>
        </div>
        <p class="block text-gray-400 text-sm mb-2 mt-4">
            Please use the email you registered with and enter your license key below to continue:
        </p>
        <validation-observer v-slot="{ validate, invalid }">
            <form @submit.prevent="activateLicense">
                <label for="email" class="block text-gray-400 text-sm font-bold mb-2 mt-4">
                    Email
                </label>
                <validation-provider rules="required|email">
                    <input
                        id="email"
                        v-model="formData.email"
                        name="email"
                        class="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="email@example.com"
                    />
                    <!-- <span>{{ errors[0] }}</!-->
                </validation-provider>
                <label for="license-key" class="block text-gray-400 text-sm font-bold mb-2 mt-4">
                    License Key
                </label>
                <validation-provider rules="required|correctKeyLength">
                    <the-mask
                        id="licenseKey"
                        v-model="formData.licenseKey"
                        name="licenseKey"
                        mask="ZZZZZ-ZZZZZ-ZZZZZ-ZZZZZ-ZZZZZ"
                        :tokens="licenseKeyTokens"
                        class="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                        @keypress.enter.prevent
                    />
                    <!-- <span>{{ errors[0] }}</!-->
                </validation-provider>
                <button
                    class="bg-red-500 text-white font-bold py-2 px-4 mt-2 rounded"
                    type="submit"
                    :disabled="invalid"
                    :class="{ 'cursor-not-allowed opacity-50': invalid }"
                >
                    Activate
                </button>
            </form>
        </validation-observer>
    </div>
</template>

<script lang="ts">
// import { VueConstructor } from 'vue';
import { Vue, Component } from 'vue-property-decorator';
// import { Validations } from 'vuelidate-property-decorators';
import { TheMask } from 'vue-the-mask';
import { ValidationProvider, ValidationObserver, setInteractionMode } from 'vee-validate';
import '../utils/validation';
import store from '../store';

setInteractionMode('aggressive');

@Component({
    components: {
        TheMask,
        ValidationProvider,
        ValidationObserver,
    },
})
export default class Activate extends Vue {
    formData: { email: string; licenseKey: string } = {
        email: '',
        licenseKey: '',
    };

    licenseKeyTokens: { Z: object } = {
        Z: {
            pattern: /[0-9a-zA-Z]/,
            transform: v => v.toLocaleUpperCase(),
        },
    };

    async activateLicense(): Promise<void> {
        await store.dispatch('activate', this.formData).then(res => {
            if (res) {
                if (store.state.isAuthenticated) {
                    this.$router.push({ path: 'home' });
                } else {
                    alert('License key activation was unsuccessful.');
                }
            } else {
                alert('An issue occurred while activating license.');
            }
        });

        // make call to firebase to attempt to grab document using licenseKey and validate email
    }
}
</script>

<style scoped lang="scss"></style>
