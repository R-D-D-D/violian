<template lang="pug">
  #courses.mt-5
    panel(title="All Courses" md="9")
      v-list(v-if="!is_student")
        v-list-item(v-for="course in courses" :key="course.id")
          v-list-item-content
            v-list-item-title.text-h5.py-0(v-text="course.name")
          v-list-item-icon
            v-btn(outlined color='indigo' @click="showCourse($event, course.id)")
              v-icon mdi-pencil
          v-list-item-icon
            v-btn(outlined color='indigo' @click="deleteCourse($event, course)")
              v-icon mdi-trash-can-outline
      v-list(v-else)
        v-list-item(v-for="course in courses" :key="course.id" @click="showCourse($event, course.id, course.lessons[0].id)")
          v-list-item-content
            v-list-item-title.text-h5.py-0(v-text="course.name")
    v-row(justify='center' v-if="!is_student")
          v-btn.mt-5(x-large to="/course/new")
            v-icon(left dark) mdi-plus-thick
            | New Course

</template>

<script>
import { mapState } from 'vuex'
import SubscriptionService from '@/services/SubscriptionService'
import CourseService from '@/services/CourseService'

export default {
  data () {
    return {  
      courses: []
    }
  },
  computed: {
    is_student () {
      return this.user.isStudent
    },

    ...mapState(['user'])
  },
  methods: {
    showCourse (event, id, lid) {
      this.$router.push({
        name: `showlesson`,
        params: {
          course_id: id,
          lesson_id: lid
        }
      })
    },

    async deleteCourse (event, course) {
      if (confirm('Are you sure?')) {
        await this.$store.dispatch('deleteCourse', course)
      }
    }
  },
  mounted: async function () {
    if (this.is_student) {
      this.courses = (await SubscriptionService.getSubscriptionInfoOfStudent(this.user.id)).data.courses
    } else {
      this.courses = (await CourseService.list(this.user.id)).data.courses
    }
  }
}
</script>

<style>
</style>
