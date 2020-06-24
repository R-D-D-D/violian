<template lang="pug">
  #student
    panel(title="Lessons By")
      v-list
        v-list-item(v-for='tutor in subscribedTutors' :key='tutor.id' @click='go_to_lessons($event, tutor)')
          //- v-list-item-icon
          //-   v-icon(v-if='rhythm.icon' color='pink') mdi-star
          v-list-item-content
            v-list-item-title(v-text='tutor.email')
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
    ...mapState(['user', 'subscribedTutors'])
  },
  methods: {
    playsequence () {
      this.tone.init()
      this.tone.playSequence(60, ['C/5/4', 'C/5/4', 'C/5/4', 'C/5/4', 'b/4/4r', 'b/4/4r', 'b/4/4r', 'b/4/4r', 'b/4/4r', 'b/4/4r', 'b/4/4r', 'b/4/4r', 'b/4/4r', 'b/4/4r', 'b/4/4r', 'b/4/4r'], 3, {})
    },

    async go_to_lessons (event, tutor) {
      if (tutor.lessons == null) {
        await this.$store.dispatch('getLessonsForStudent', tutor)
      }
      this.$router.push(`/lesson/index/${tutor.id}`)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
