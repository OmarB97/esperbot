import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isRegistered: false
  },
  mutations: {},
  actions: {
    isRegistered() {
      return this.state.isRegistered;
    }
  },
  modules: {}
});
