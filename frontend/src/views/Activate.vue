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
        <label for="email" class="block text-gray-400 text-sm font-bold mb-2 mt-4">
            Email
        </label>
        <input
            id="email"
            v-model="formData.email"
            class="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="email@example.com"
        />
        <label for="license-key" class="block text-gray-400 text-sm font-bold mb-2 mt-4">
            License Key
        </label>
        <the-mask
            v-model="formData.licenseKey"
            mask="ZZZZZ-ZZZZZ-ZZZZZ-ZZZZZ-ZZZZZ"
            :tokens="licenseKeyTokens"
            class="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
        />
        <button
            class="bg-red-500 text-white font-bold py-2 px-4 mt-2 rounded"
            :class="{ 'cursor-not-allowed opacity-50': !formData.valid }"
            @click="activateLicense"
        >
            Activate
        </button>
    </div>
</template>

<script lang="ts">
// import { VueConstructor } from 'vue';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Validations } from 'vuelidate-property-decorators';
import { required, email, and, alphaNum } from 'vuelidate/lib/validators';
import { correctKeyLength } from '../utils/validators';
import { TheMask } from 'vue-the-mask';

// import { mask } from 'vue-the-mask';

//             :tokens="licenseKeyTokens"

@Component({
    components: {
        TheMask,
    },
})
export default class Activate extends Vue {
    formData: { email: string; licenseKey: string; valid: boolean } = {
        email: '',
        licenseKey: '',
        valid: false,
    };

    licenseKeyTokens: { Z: object } = {
        Z: {
            pattern: /[0-9a-fA-F]/,
            transform: v => v.toLocaleUpperCase(),
        },
    };

    @Validations()
    validations = {
        email: { and, required, email },
        licenseKey: { required, alphaNum, correctKeyLength: correctKeyLength(this.formData.licenseKey) },
    };

    // directives = { mask };
    // validations() {
    //     return {
    //         formData: {
    //             email: { required, email, and },
    //             licenseKey: { required, correctKeyLength: correctKeyLength(this.formData.licenseKey), alphaNum },
    //         },
    //     };
    // }

    activateLicense() {
        console.log('It worked');
    }

    licenceKeyTokens = {
        Z: {
            pattern: '/[0-9a-fA-F]/',
            transform: v => v.toLocaleUpperCase(),
        },
    };
}
</script>

<style scoped lang="scss"></style>
