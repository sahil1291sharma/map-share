import Vue from "vue";
import Vuex from "vuex";

import App from "./App.vue";

Vue.config.productionTip = false;

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentLocation: null,
  },
  mutations: {
    moveToLocation(state, locationId) {
      console.log("called");
      state.currentLocation = locationId;
    },
  },
});

new Vue({
  render: (h) => h(App),
  store,
}).$mount("#app");
