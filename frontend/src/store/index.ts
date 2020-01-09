import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations } from 'vuexfire';
import { DataStore } from '@/storage/datastore';
import { DB } from '@/firebase/db';
import { firestore } from 'firebase';
import ValidateAuth from '@/utils/validate_auth';

Vue.use(Vuex);
const dataStore: DataStore = new DataStore().getUserData();

export default new Vuex.Store({
    state: {
        isActivated: dataStore.userData.getIsActivated(),
        isAuthenticated: false,
    },
    mutations: {
        ...vuexfireMutations,
        SET_IS_AUTHENTICATED(state, isAuthenticated) {
            state.isAuthenticated = isAuthenticated;
        },
    },
    actions: {
        async authenticate({ commit }) {
            if (this.state.isActivated) {
                const docRef: firestore.DocumentReference = DB.collection('users').doc(
                    dataStore.userData.getLicenseKey(),
                );
                await docRef.get().then(doc => {
                    if (doc.exists) {
                        const docData = doc.data() as firestore.DocumentData;
                        if (ValidateAuth.validateUser(dataStore.userData, docRef, docData)) {
                            commit('SET_IS_AUTHENTICATED', true);
                        }
                    }
                });
            }
            // if (this.state.isRegistered) {
            //     // do FireStore authentication checks
            // }
            // return this.state.isRegistered;
        },
    },
    modules: {},
});
