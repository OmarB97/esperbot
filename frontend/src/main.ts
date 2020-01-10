import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/assets/css/tailwind.css';
import { firestorePlugin } from 'vuefire';
import { Component } from 'vue-property-decorator';

Vue.config.productionTip = false;
Vue.use(firestorePlugin);

Component.registerHooks(['validations']);

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
