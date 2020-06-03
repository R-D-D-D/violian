<template lang="pug">
  div.register
    h1 Register an account with us!
    input(v-model="email" name="email" type="text" placeholder="email")
    br
    input(v-model="password" name="password" type="text" placeholder="password")
    br
    button(@click="register") register
</template>

<script>
import Authentication from '@/services/Authentication'
export default {
  name: 'Register',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async register () {
      const response = await Authentication.register({
        email: this.email,
        password: this.password
      })
      console.log(response.data)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
