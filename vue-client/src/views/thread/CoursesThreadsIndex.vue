<template lang="pug">
  #student.mt-5
    panel(title="My Courses" v-if="user.isTutor")
      v-list
        v-list-item(v-for='(course, idx) in userOwnedCourses' :key='course.id' @click="goToThread($event, course)")
          //- v-list-item-icon
          //-   v-icon(v-if='rhythm.icon' color='pink') mdi-star
          v-list-item-content
            v-list-item-title.text-h5.py-0(v-text='course.name')
          v-list-item-icon
            .notification 
              p.pa-0.mx-auto {{ course.unreadStudentPost }}
    panel(title="Subscribed Courses" v-else)
      v-list
        v-list-item(v-for='(course, idx) in userSubscribedCourses' :key='course.id' @click="showThread($event, course)")
          v-list-item-content
            v-list-item-title.text-h5.py-0(v-text='course.name')
          v-list-item-icon
            .notification 
              p.pa-0.mx-auto {{ course.unreadTutorPost }}
</template>

<script>
import { mapState } from 'vuex'
import SubscriptionService from '@/services/SubscriptionService'
import CourseService from '@/services/CourseService'

export default {
  name: 'CoursesThreadsIndex',
  data () {
    return {
      avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
      threads: [],
      userOwnedCourses: [],
      userSubscribedCourses: []
    }
  },

  computed: mapState(['user']),

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
  },

  mounted: async function () {
    if (this.user.isStudent) {
      const studentResponse = await SubscriptionService.getSubscriptionInfoOfStudent(this.user.id);
      this.userSubscribedCourses = studentResponse.data.courses
    } else {
      const response = await CourseService.list(this.user.id);
      this.userOwnedCourses = response.data.courses
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.notification {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 16px;
  line-height: 1.8rem;
  color: white;
  background: #C62828;
  text-align: center;
}
</style>
