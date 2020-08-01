<template lang="pug">
  #register
    panel(title="Register")
      //- v-tooltip(bottom)
      //-   template(v-slot:activator="{ on, attrs }")
      //-     v-toolbar-title(dark v-bind="attrs" v-on="on") Login form
      //-   span Log in
      v-card-text
        v-form.text-center(ref="form" v-on:submit.prevent="register")
          v-text-field(
            label='Username' 
            name='username' 
            prepend-icon='mdi-account' 
            type='text' 
            v-model='username' 
            :rules="nameRules")
            
          v-text-field(
            label="Email" 
            name="email" 
            prepend-icon="mdi-account" 
            type="text" 
            v-model="email" 
            :rules="emailRules")
            
          v-text-field(
            label="Password" 
            name="password" 
            prepend-icon="mdi-lock" 
            type="password" 
            v-model="password" 
            :rules="passwordRules")

          v-radio-group(v-model="role" row="")
            v-radio(label="Student" value="Student" color="indigo")
            v-radio(label="Tutor" value="Tutor" color="indigo")

          v-spacer
          v-btn.mt-5(type="submit" :loading="loading" :disabled="loading") Register
          v-spacer
      v-card-text
        .error(v-html="error") {{ error }}
</template>

<script>
import AuthenticationService from "@/services/AuthenticationService";

export default {
  name: "Register",
  data() {
    return {
      username: "",
      nameRules: [
        v => !!v || "Username is required",
        v => new RegExp(/^[a-zA-Z ]{2,30}$/).test(v) || "Name must be alphanumeric characters and of length 2 - 32"
      ],
      email: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      password: "",
      passwordRules: [
        v => !!v || "Password is required",
        v => new RegExp("^[a-zA-Z0-9]{8,32}$").test(v) || "Password must be alphanumeric characters and of length 8 - 32",
      ],
      error: null,
      loading: false,
      role: ""
    };
  },
  methods: {
    async register() {
      if (!this.$refs.form.validate())
        return;
      this.error = "";
      this.loading = true;
      try {
        const response = await AuthenticationService.register({
          username: this.username,
          email: this.email,
          password: this.password,
          role: this.role
        });
        this.loading = false;
        this.$store.dispatch("setToken", response.data.token);
        this.$store.dispatch("setUser", response.data.user);
        this.$router.push("/");
      } catch (err) {
        this.error = err.response.data.error;
        this.loading = false;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
