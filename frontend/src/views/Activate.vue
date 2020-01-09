<template>
    <div class>
        <div class="flex-row w-full content-center mb-6">
            <p class="text-blue-600 text-center font-semibold text-2xl font-sans">Welcome to Esperbot!</p>
        </div>
        <p>Please activate your License Key below to continue:</p>
        <label class="block text-gray-700 text-sm font-bold mb-2 mt-4" for="password">License Key</label>
        <input
            id="license-key"
            class="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
        />
        <button class="bg-red-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">
            Activate
        </button>
    </div>
</template>

<script lang="ts">
// import { VueConstructor } from 'vue';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Activate extends Vue {}
</script>

<style scoped lang="scss"></style>
