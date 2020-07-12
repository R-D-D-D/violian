<template lang="pug">
  #student
    panel(title="All Courses" v-if="user.isTutor")
      v-list
        v-list-item(v-for='(course, idx) in userOwnedCourses' :key='course.id' @click="goToThread($event, course)")
          //- v-list-item-icon
          //-   v-icon(v-if='rhythm.icon' color='pink') mdi-star
          v-list-item-content
            v-list-item-title(v-text='course.name')
          v-list-item-avatar
            v-img(:src='avatar')
    panel(title="Subscribed Courses" v-else)
      v-list
        v-list-item(v-for='(course, idx) in userSubscribedCourses' :key='course.id' @click="showThread($event, course)")
          v-list-item-content
            v-list-item-title(v-text='course.name')
          v-list-item-avatar
            v-img(:src='avatar')
</template>

<script>
import Panel from '@/components/Panel'
import { mapState } from 'vuex'

export default {
  name: 'CoursesThreadsIndex',
  data () {
    return {
      avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
      threads: []
    }
  },

  components: {
    'panel': Panel
  },

  computed: mapState(['user', 'userOwnedCourses', 'userSubscribedCourses']),

  methods: {
    goToThread (event, course) {
      this.$router.push(`/course/threads/index/${course.id}`)
    },

    showThread (event, course) {
      this.$router.push({
        name: `showthread`,
        params: {
          course_id: course.id,
          student_id: this.user.id
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
