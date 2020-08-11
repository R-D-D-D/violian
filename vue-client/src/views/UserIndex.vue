<template lang="pug">
  #student(v-if="user.email == 'wangrunding@gmail.com'")
    panel(title="Users" md="10")
      v-list
        v-list-item(v-for='user in allUsers' :key='user.id')
          v-list-item-content
            v-list-item-title.mr-5(v-text='user.username')
          v-list-item-content
            v-list-item-title.mr-5(v-text='user.email')
          v-list-item-content
            v-list-item-title.mr-5(v-if='user.isStudent') Student
            v-list-item-title.mr-5(v-else) Tutor
          v-list-item-icon
            v-btn(icon)
              v-icon(@click="login($event, user)") mdi-eye
</template>

<script>
import UserService from '@/services/UserService'
import AuthenticationService from '@/services/AuthenticationService'
import {mapState} from 'vuex'

export default {
  name: 'UserIndex',
  data () {
    return {
      allUsers: []
    }
  },

  computed: mapState(['user']),

  methods: {
    async login (event, user) {
      try {
        const response = await AuthenticationService.adminLogin({
          email: user.email
        })

        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
        
        this.$router.push({
          name: 'home'
        })
      } catch (err) {
        // console.log(err)
        this.error = err.response.data.error
        this.loading = false
      }
    }
  },

  mounted: async function () {
    this.allUsers = (await UserService.getAllUsers()).data.users
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
