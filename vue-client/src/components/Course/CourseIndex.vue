<template lang="pug">
  #courses.mt-5
    panel(title="All Courses" md="9")
      v-list(v-if="!is_student")
        v-list-item(v-for="course in userOwnedCourses" :key="course.id")
          v-list-item-content
            v-list-item-title.text-h5.py-0(v-text="course.name")
          v-list-item-icon
            v-btn(outlined color='indigo' @click="showCourse($event, course.id)")
                v-icon mdi-pencil
      v-list(v-else)
        v-list-item(v-for="course in tutor.courses" :key="course.name" @click="showcourse($event, course.id)")
          v-list-item-content
            v-list-item-title.text-h5.py-0(v-text="course.name")
          v-list-item-content
            v-list-item-title(v-text='course.date')
    v-row(justify='center' v-if="!is_student")
          v-btn.mt-5(x-large to="/course/new")
            v-icon(left dark) mdi-plus-thick
            | New Course
          v-btn.mt-5(x-large @click="test")
            v-icon(left dark) mdi-plus-thick
            | Add Lesson

</template>

<script>
import Panel from '@/components/Panel'
import { mapState } from 'vuex'

export default {
  data () {
    return {  
      dialog: false,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
      ],
      validation: {
        namePassed: false,
      },
      error: null,
      loading: false,
      price: '0.0',
      priceRules: [
        v => !!v || "Price is required",
        v => new RegExp(/^\d+(?:\.\d{0,2})$/).test(v) || "Price must be a number with maximum 2 decimal places"
      ]
    }
  },
  computed: {
    is_student () {
      return this.user.isStudent
    },

    tutor () {
      return this.$store.getters.tutorFromSubscribedTutors(this.$route.params.tutor_id)
    },

    ...mapState(['user', 'userOwnedCourses', 'userSubscribedCourses'])
  },
  components: {
    'panel': Panel
  },
  methods: {
    showCourse (event, id) {
      if (this.is_student) {
        this.$router.push(`/course/show/${this.tutor.id}/${id}`)
      } else {
        this.$router.push(`/course/show/${this.user.id}/${id}`)
      }
    },

    test () {
      this.$store.dispatch('addLesson', {
        CourseId: 8,
        name: 'hey',
        description: 'hey',
        duration: 10
      })
    }
  },
  mounted: async function () {
    // const response = await CourseService.list()
  }
}
</script>

<style>
</style>
