import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations } from 'vuexfire';
import { DataStore } from '@/storage/datastore';
import ValidateAuth from '@/utils/validate_auth';

Vue.use(Vuex);
const dataStore: DataStore = new DataStore();

export default new Vuex.Store({
    state: {
        isActivated: dataStore.getIsActivated(),
        isAuthenticated: false,
    },
    mutations: {
        ...vuexfireMutations,
        SET_IS_ACTIVATED(state, isActivated): void {
            state.isActivated = isActivated;
        },
        SET_IS_AUTHENTICATED(state, isAuthenticated): void {
            state.isAuthenticated = isAuthenticated;
        },
    },
    actions: {
        async activate({ commit }, formData): Promise<boolean> {
            return ValidateAuth.activateUser(dataStore, formData).then(res => {
                if (res) {
                    commit('SET_IS_ACTIVATED', true);
                    commit('SET_IS_AUTHENTICATED', true);
                    return res;
                }
                return false;
            });
        },

        async authenticate({ commit }): Promise<boolean> {
            if (this.state.isActivated) {
                return ValidateAuth.authenticateUser(dataStore).then(res => {
                    if (res) {
                        commit('SET_IS_AUTHENTICATED', true);
                        return res;
                    }
                    return false;
                });
            } else {
                return false;
            }
        },
    },
    modules: {},
});
