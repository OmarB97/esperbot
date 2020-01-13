import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations } from 'vuexfire';
import { DataStore } from '@/storage/datastore';
import ValidateAuth from '@/utils/validate_auth';
import { AUTH_ERROR_CODE } from '@/data/models/user_auth_data';

Vue.use(Vuex);
const dataStore: DataStore = new DataStore();

export default new Vuex.Store({
    state: {
        isActivated: dataStore.getIsActivated(),
        isAuthenticated: false,
        authData: {},
    },
    mutations: {
        ...vuexfireMutations,
        SET_IS_ACTIVATED(state, isActivated): void {
            state.isActivated = isActivated;
        },
        SET_IS_AUTHENTICATED(state, isAuthenticated): void {
            state.isAuthenticated = isAuthenticated;
        },
        SET_AUTH_DATA(state, authData): void {
            state.authData = authData;
        },
    },
    actions: {
        async activate({ commit }, formData): Promise<{ res: boolean; err: AUTH_ERROR_CODE }> {
            return ValidateAuth.activateUser(dataStore, formData).then(res => {
                if (res) {
                    commit('SET_IS_ACTIVATED', res.res);
                    commit('SET_IS_AUTHENTICATED', res.res);
                    commit('SET_AUTH_DATA', res.data);
                }
                return {
                    res: res.res,
                    err: res.err,
                };
            });
        },

        async authenticate({ commit }): Promise<{ res: boolean; err: AUTH_ERROR_CODE }> {
            return ValidateAuth.authenticateUser(dataStore).then(res => {
                if (res.res) {
                    commit('SET_IS_AUTHENTICATED', res.res);
                    commit('SET_AUTH_DATA', res.data);
                }
                return {
                    res: res.res,
                    err: res.err,
                };
            });
        },
    },
    modules: {},
});
