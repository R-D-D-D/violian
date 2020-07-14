<template lang="pug">
  #student
    panel(title="Tutors")
      v-list
        v-list-item(v-for='tutor in allTutors' :key='tutor.id')
          v-list-item-icon
            v-btn(@click="subscribe($event, tutor)" dark color="#ec5252" v-if="!(subscribedTutorsId.includes(tutor.id))") Subscribe
            v-btn(@click="" dark color="grey darken-2" v-else disable) Subscribed
          v-list-item-content
            v-list-item-title.mr-5(v-text='tutor.username')
          v-list-item-avatar
            v-img(:src='avatar')
</template>

<script>
import Panel from '@/components/Panel'
import { mapState } from 'vuex'

export default {
  name: 'Student',
  data () {
    return {
      avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg'
    }
  },
  components: {
    'panel': Panel
  },
  computed: {
    subscribedTutorsId () {
      return this.allTutors.map(tutor => tutor.id)
    },

    ...mapState(['user', 'allTutors'])
  },
  methods: {
    async subscribe (event, tutor) {
      await this.$store.dispatch('subscribe', {
        studentId: this.user.id,
        tutorId: tutor.id
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
