import Vue from "vue"
import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate"
import SubscriptionService from "../services/SubscriptionService"

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  plugins: [createPersistedState()],
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false,
    notifications: null
  },

  mutations: {
    resetState (state) {
      state.token = null,
      state.notifications = null,
      state.user = null,
      state.isUserLoggedIn = false
    },

    setToken (state, token) {
      state.token = token;
    },

    setUser (state, user) {
      state.user = user;
    },

    setNotifications (state, notifications) {
      state.notifications = notifications
    },

    logIn (state) {
      state.isUserLoggedIn = true;
    },

    logOut (state) {
      state.isUserLoggedIn = false;
    },
  },

  actions: {
    // user management
    setToken ({commit}, token) {
      commit("setToken", token);
      if (token)
        commit("logIn");
      else {
        commit("logOut");
        commit("resetState");
      }
    },

    setUser ({commit}, user) {
      commit("setUser", user);
    },

    setNotifications ({commit}, notifications) {
      commit('setNotifications', notifications)
    },

    // subscription management
    async subscribe(store, payload) {
      try {
        await SubscriptionService.subscribe(payload);
        store.dispatch("getCoursesForStudent", {
          id: payload.studentId
        });
      } catch (err) {
        console.log(err);
      }
    },
  }
})
