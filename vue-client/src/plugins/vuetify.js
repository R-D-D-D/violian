import Vue from "vue";
import Vuetify from "vuetify/lib";
import bpm from "@/components/CustomIcons/bpm"

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    values: {
      custom_bpm: {
        component: bpm
      }
    },
  }
});
