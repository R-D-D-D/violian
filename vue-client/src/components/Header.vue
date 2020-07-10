<template lang="pug">
  div
    v-app-bar(
      dark
      color="indigo"
      app
      dense
      absolute
      v-bind:class="{ hide: hidden }"
    )
      v-app-bar-nav-icon(@click="drawer = true")

      router-link.pl-3(to="/")
        v-toolbar-title Rhythmy

      v-spacer

      v-toolbar-items(v-if="!$store.state.isUserLoggedIn")
        v-btn(depressed to="/register" color="indigo") Register
        v-btn(depressed to="/login" color="indigo") Log In
      v-toolbar-items(v-if="$store.state.isUserLoggedIn")
        v-btn(depressed to="/course/index" color="indigo" v-if="$store.state.user.isStudent") My Courses
        v-btn(depressed to="/course/index" color="indigo" v-if="$store.state.user.isTutor") My Courses
        v-btn(depressed @click="logout" color="indigo") Log Out
    
    v-navigation-drawer(v-model='drawer' absolute temporary)
      v-list(nav dense v-if="$store.state.isUserLoggedIn")
        v-list-item-group(active-class="text--accent-4" )
          v-list-item(to="/")
            v-list-item-icon
              v-icon mdi-home
            v-list-item-title Home
          v-list-item(to="/student" v-if="$store.state.user.isStudent")
            v-list-item-icon
              v-icon mdi-playlist-music
            v-list-item-title My Courses
          v-list-item(to="/course/index" v-if="$store.state.user.isTutor")
            v-list-item-icon
              v-icon mdi-notebook-outline
            v-list-item-title My Courses
          v-list-item(v-if="$store.state.isUserLoggedIn" @click="logout")
            v-list-item-icon
              v-icon mdi-logout
            v-list-item-title Log Out
      v-list(nav dense v-else)
        v-list-item-group(active-class="text--accent-4")
          v-list-item(to="/")
            v-list-item-icon
              v-icon mdi-home
            v-list-item-title Home
          v-list-item(to="/register" v-if="!$store.state.isUserLoggedIn")
            v-list-item-icon
              v-icon mdi-account
            v-list-item-title Register
          v-list-item(to="/login" v-if="!$store.state.isUserLoggedIn")
            v-list-item-icon
              v-icon mdi-account
            v-list-item-title Log In
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      drawer: false
    }
  },

  methods: {
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push('/')
    }
  },

  computed: {
    hidden () {
      return this.$store.state.hideNav;
    }
  }
}
</script>

<style scoped>
.hide {
  display: none !important;
}

a, a:link, a:visited, a:active, a:hover {
  text-decoration: none;
  color: white;
}
</style>
