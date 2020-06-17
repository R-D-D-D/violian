<template lang="pug">
  #nav
    v-app-bar(
      light
      app
    )
      v-app-bar-nav-icon(@click="drawer = true")

      v-toolbar-title Rhythm Academy

      v-spacer

      v-toolbar-items
        v-btn(depressed to="register") Register
        v-btn(depressed to="login") Log In
    
    v-navigation-drawer(v-model='drawer' absolute temporary)
      v-list(nav dense)
        v-list-item-group(active-class='text--accent-4')
          v-list-item(to='home')
            v-list-item-icon
              v-icon mdi-home
            v-list-item-title Home
          v-list-item(to='register')
            v-list-item-icon
              v-icon mdi-account
            v-list-item-title Account
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      drawer: false
    }
  }
}
</script>

<style>
</style>
