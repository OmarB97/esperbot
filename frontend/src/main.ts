import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/assets/css/tailwind.css';
import { firestorePlugin } from 'vuefire';
import Vuelidate from 'vuelidate';
import './registerComponentHooks';

Vue.config.productionTip = false;
Vue.use(firestorePlugin, Vuelidate);

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
