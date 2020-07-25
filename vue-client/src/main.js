import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import vuetify from "./plugins/vuetify";
import Panel from "@/components/Globals/Panel"

Vue.config.productionTip = false;
Vue.component('panel', Panel)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
