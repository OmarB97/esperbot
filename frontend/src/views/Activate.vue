<template>
    <div class="flex flex-col items-center justify-center">
        <div class="flex-row w-full content-center mb-6">
            <p class="text-blue-500 text-center font-semibold text-2xl font-sans">
                Welcome to Esperbot!
            </p>
        </div>
        <p class="block text-gray-400 text-sm mb-2 mt-4">
            Please use the email you registered with and enter your license key below to continue:
        </p>
        <auth-form form-type="activate" @activate="activateLicense"></auth-form>
    </div>
</template>

<script lang="ts">
// import { VueConstructor } from 'vue';
import { Vue, Component } from 'vue-property-decorator';
import store from '../store';
// import { Validations } from 'vuelidate-property-decorators';
import { TheMask } from 'vue-the-mask';
import { ValidationProvider, ValidationObserver, setInteractionMode } from 'vee-validate';
import '../utils/validation';
import AuthForm from '../components/AuthForm.vue';

setInteractionMode('aggressive');

@Component({
    components: {
        TheMask,
        ValidationProvider,
        ValidationObserver,
        AuthForm,
    },
})
export default class Activate extends Vue {
    async activateLicense(formData: { email: string; licenseKey: string }): Promise<void> {
        await store.dispatch('activate', formData).then(res => {
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
    }
}
</script>

<style scoped lang="scss"></style>
