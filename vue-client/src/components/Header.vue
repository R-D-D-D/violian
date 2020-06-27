<template lang="pug">
  #nav
    v-app-bar(
      dark
      color="indigo"
      app
    )
      v-app-bar-nav-icon(@click="drawer = true")

      v-toolbar-title Rhythm Academy

      v-spacer

      v-toolbar-items(v-if="!$store.state.isUserLoggedIn")
        v-btn(depressed to="/register" color="indigo") Register
        v-btn(depressed to="/login" color="indigo") Log In
      v-toolbar-items(v-if="$store.state.isUserLoggedIn")
        v-btn(depressed to="/student" color="indigo" v-if="$store.state.user.isStudent") Lessons
        v-btn(depressed @click="browseAllTutors" color="indigo" v-if="$store.state.user.isStudent") All Tutors
        v-btn(depressed @click="logout" color="indigo") Log Out
    
    v-navigation-drawer(v-model='drawer' absolute temporary)
      v-list(nav dense v-if="$store.state.isUserLoggedIn")
        v-list-item-group(active-class="text--accent-4" )
          v-list-item(to="/home")
            v-list-item-icon
              v-icon mdi-home
            v-list-item-title Home
          v-list-item(to="/student" v-if="$store.state.user.isStudent")
            v-list-item-icon
              v-icon mdi-playlist-music
            v-list-item-title Lessons
          v-list-item(@click="browseAllTutors" v-if="$store.state.user.isStudent")
            v-list-item-icon
              v-icon mdi-account
            v-list-item-title All Tutors
          v-list-item(@click="go_to_lessons" v-if="$store.state.user.isTutor")
            v-list-item-icon
              v-icon mdi-notebook-outline
            v-list-item-title Lessons
          v-list-item(v-if="$store.state.isUserLoggedIn" @click="logout")
            v-list-item-icon
              v-icon mdi-logout
            v-list-item-title Log Out
      v-list(nav dense v-else)
        v-list-item-group(active-class="text--accent-4")
          v-list-item(to="/home")
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
    },

    async browseAllTutors () {
      if (this.$store.state.allTutors.length == 0) {
        await this.$store.dispatch('getAllTutors')
      }
      this.$router.push('/tutor/index')
    },

    go_to_lessons () {
      this.$router.push(`/lesson/index/${this.$store.state.user.id}`)
    }
  }
}
</script>

<style>
</style>
