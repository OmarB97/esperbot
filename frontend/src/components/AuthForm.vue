<template>
    <div class="w-full max-w-sm mt-4">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <validation-observer v-slot="{ validate, invalid }">
                <form @submit.prevent="submitForm">
                    <label for="email" class="block text-gray-700 text-sm font-bold mb-2">
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
                    </validation-provider>
                    <!-- eslint-disable-next-line prettier/prettier -->
                    <label for="license-key" class="block text-gray-700 text-sm font-bold mb-2 mt-4">
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
                    </validation-provider>
                    <button
                        class="bg-red-500 text-white font-bold py-2 px-4 mt-2 rounded"
                        type="submit"
                        :disabled="invalid"
                        :class="{ 'cursor-not-allowed opacity-50': invalid }"
                    >
                        {{ displaySubmitButtonText() }}
                    </button>
                </form>
            </validation-observer>
        </form>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { TheMask } from 'vue-the-mask';
import { ValidationProvider, ValidationObserver, setInteractionMode } from 'vee-validate';
import '../utils/validation';

setInteractionMode('aggressive');

@Component({
    name: 'AuthForm',
    components: {
        TheMask,
        ValidationProvider,
        ValidationObserver,
    },
})
export default class AuthForm extends Vue {
    @Prop(String) readonly formType;

    formData: { email: string; licenseKey: string } = {
        email: '',
        licenseKey: '',
    };

    licenseKeyTokens: { Z: object } = {
        Z: {
            pattern: /[0-9a-zA-Z]/,
            transform: (v: string): string => v.toLocaleUpperCase(),
        },
    };

    displaySubmitButtonText(): string {
        if (this.formType === 'activate') {
            return 'Activate';
        } else {
            return 'Submit';
        }
    }

    submitForm(): void {
        if (this.formType === 'activate') {
            this.$emit('activate', this.formData);
        } else if (this.formType === 'authenticate') {
            this.$emit('authenticate', this.formData);
        }
    }
}
</script>

<style></style>
