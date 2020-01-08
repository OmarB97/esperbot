import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations } from 'vuexfire';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isRegistered: false,
    },
    mutations: {
        ...vuexfireMutations,
    },
    actions: {
        isRegistered() {
            return this.state.isRegistered;
        },
    },
    modules: {},
});
