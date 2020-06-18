import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false
  },

  mutations: {
    setToken (state, token) {
      state.token = token
    },

    setUser (state, user) {
      state.user = user
    },

    logIn (state) {
      state.isUserLoggedIn = true
    },

    logOut (state) {
      state.isUserLoggedIn = false
    }
  },

  actions: {
    setToken ({commit}, token) {
      commit('setToken', token)
      if (token)
        commit('logIn')
      else
        commit('logOut')
    },

    setUser ({commit}, user) {
      commit('setUser', user)
    }
  }
})
