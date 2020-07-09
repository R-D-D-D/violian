<template lang="pug">
  #student
    panel(title="All Courses")
      v-list
        v-list-item(v-for='course in allCourses' :key='course.id' @click='go_to_course($event, tutor)')
          //- v-list-item-icon
          //-   v-icon(v-if='rhythm.icon' color='pink') mdi-star
          v-list-item-content
            v-list-item-title(v-text='tutor.username')
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
    ...mapState(['user', 'allCourses'])
  },
  methods: {
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
