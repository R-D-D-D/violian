<template lang="pug">
  #student
    panel(title="All Courses")
      v-list
        v-list-item(v-for='(student, idx) in students' :key='student.id' @click="showThread($event, student)")
          //- v-list-item-icon
          //-   v-icon(v-if='rhythm.icon' color='pink') mdi-star
          v-list-item-content
            v-list-item-title(v-text='student.username')
          v-list-item-avatar
            v-img(:src='avatar')
</template>

<script>
import Panel from '@/components/Panel'
import { mapState } from 'vuex'
import SubscriptionService from '@/services/SubscriptionService'

export default {
  name: 'CourseThreadsIndex',
  data () {
    return {
      avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
      students: []
    }
  },

  components: {
    'panel': Panel
  },

  computed: {
    ...mapState(['user', 'userOwnedCourses'])
  },

  methods: {
    showThread (event, student) {
      this.$router.push(`/course/threads/show/${this.$route.params.course_id}/${student.id}`)
    }
  },

  mounted: async function () {
    const response = await SubscriptionService.getSubscriptionInfoOfCourse(this.$route.params.course_id)
    this.students = response.data.students
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
