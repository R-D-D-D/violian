<template lang="pug">
  #student
    panel(title="Users")
      v-list
        v-list-item(v-for='user in allUsers' :key='user.id')
          v-list-item-content
            v-list-item-title.mr-5(v-text='user.username')
          v-list-item-content
            v-list-item-title.mr-5(v-text='user.email')
          v-list-item-content
            v-list-item-title.mr-5(v-if='user.isStudent') Student
            v-list-item-title.mr-5(v-else) Tutor
</template>

<script>
import UserService from '@/services/UserService'

export default {
  name: 'UserIndex',
  data () {
    return {
      allUsers: []
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
