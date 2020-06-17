<template lang="pug">
  //- div.register
    //- h1 Register an account with us!
    //- input(v-model="email" name="email" type="text" placeholder="email")
    //- br
    //- input(v-model="password" name="password" type="text" placeholder="password")
    //- br
    //- button(@click="register") register
    //- br
    //- .error(v-html="error") {{ error }}

  #login
    v-row(align='center' justify='center')
      v-col(cols='12' sm='10' md='6')
        v-card.elevation-12
          v-toolbar(color='primary' dark flat)
            v-toolbar-title Login form
            v-spacer
            //- v-tooltip(bottom)
            //-   template(v-slot:activator='{ on, attrs }')
            //-     v-toolbar-title(dark v-bind='attrs' v-on='on') Login form
            //-   span Log in
          v-card-text
            v-form
              v-text-field(
                label='Email' 
                name='email' 
                prepend-icon='mdi-account' 
                type='text' 
                v-model='email' 
                :rules="emailRules")
              v-text-field#password(
                label='Password' 
                name='password' 
                prepend-icon='mdi-lock' 
                type='password' 
                v-model='password' 
                :rules="passwordRules")
          v-card-actions
            v-spacer
            v-btn(color='primary' @click="login" dark :loading='loading') Register
            v-spacer
          v-card-text
            .error(v-html="error") {{ error }}
</template>

<script>
import Authentication from '@/services/Authentication'
export default {
  name: 'LogIn',
  data () {
    return {
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password is required',
        v => new RegExp('^[a-zA-Z0-9]{8,32}$').test(v) || 'Name must be alphanumeric characters and of length 8 - 32',
      ],
      error: null,
      loading: false
    }
  },
  methods: {
    async login () {
      this.error = ''
      this.loading = true
      try {
        const response = await Authentication.login({
          email: this.email,
          password: this.password
        })
        console.log(response.data)
        this.loading = false
      } catch (err) {
        this.error = err.response.data.error
        this.loading = false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
