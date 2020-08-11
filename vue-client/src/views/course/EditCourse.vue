<template lang="pug">
  v-container(v-if="course")
    v-row.justify-center
      v-col(cols="12")
        v-card.text-left(outlined).mb-12
          v-card-title.display-1.px-10 Course Info
            v-spacer
            v-btn(outlined color='indigo' right @click='editCourse')
              v-icon(color="indigo") mdi-pencil
          v-divider
          v-card-text.px-10
            v-row
              v-col(cols="12" md="4")
                strong Title: 
                | {{ course.name }}
              v-col(cols="12" md="4")
                strong Price: 
                | S$ {{ course.price }}
              v-col(cols="12" md="4")
                strong Tagline: 
                | {{ course.tagline }}
            v-row
              v-col(cols="12")
                strong Description: 
                | {{ course.description }}
            v-row
              v-col(cols="12" md="4")
                strong Level: 
                | {{ course.level }}
              v-col(cols="12" md="4")
                strong Instrument: 
                | {{ course.instrument }}
              v-col(cols="12" md="4")
                strong Language: 
                | {{ course.language }}
            
            v-row
              v-col(cols="12" md="4" v-if="course.previewVideoUrl")
                strong Preview video: 
                | {{ course.previewVideoUrl.split('/')[6] }}
              v-col(cols="12" md="4" v-if="course.coverPhotoUrl")
                strong Cover photo: 
                | {{ course.coverPhotoUrl.split('/')[6] }}
            
            v-row(v-if="course.learningPoints")
              v-col(cols="12")
                strong What your student will learn:
              v-col.py-0(v-for="learningPoint in course.learningPoints.split('&')" cols="12")
                p {{ learningPoint }}

            v-row(v-if="course.targetAudiences")
              v-col(cols="12")
                strong Who are this course for?
              v-col.py-0(cols="12" v-for="targetAudience in course.targetAudiences.split('&')")
                p {{ targetAudience }}

            v-row(v-if="course.requirements")
              v-col(cols="12")
                strong What are the requirements?
              v-col.py-0(cols="12" v-for="requirement in course.requirements.split('&')")
                p {{ requirement }}

    
    v-row.justify-center.mt-5
      v-col(cols="12")
        v-card.text-left(outlined).mb-12.pb-5
          v-card-title.display-1.px-10 Lessons
            v-spacer
            v-btn(outlined color='indigo' right @click='newLesson')
              v-icon(color="indigo") mdi-plus
          v-divider
          v-card-text.px-10.pb-0(v-for="(lesson, idx) in course.lessons")
            v-row
              v-col(cols="12" md="4")
                strong Name: 
                | {{ lesson.name }}
              v-col(cols="12" md="4")
                strong Duration: 
                | {{ lesson.duration }}
              v-spacer
              v-btn.mr-3(outlined color='indigo' right @click='editLesson($event, lesson)')
                v-icon(color="indigo") mdi-pencil
            v-divider(v-if="idx != course.lessons.length - 1")
    v-row.justify-center()
      v-col.text-center
        v-btn(color="indigo" dark to="/course/index" v-if="course.publishNow") Confirm
        v-btn(color="indigo" dark v-else @click="publishCourse") Publish Now
        v-btn(to="/course/index") Cancel

</template>

<script>
/* eslint-disable*/
import CourseService from '@/services/CourseService'
import LessonService from '@/services/LessonService'
import ExerciseService from '@/services/ExerciseService'
import vexUI from "@/plugins/vex"
import {mapState} from "vuex"

export default {
  name: 'editCourse',
  data () {
    return {
      course: null
    }
  },

  computed: mapState(['user']),

  methods: {
    editCourse () {
      this.$router.push(`/course/form/${this.course.id}`)
    },

    editLesson (event, lesson) {
      this.$router.push(`/lesson/edit-form/${lesson.id}`)
    },

    newLesson (event, lesson) {
      this.$router.push(`/lesson/new-form/${this.course.id}`)
    },

    async publishCourse () {
      let formData = new FormData()
      formData.set('id', this.course.id)
      formData.set('publishNow', true)
      await CourseService.edit(formData)
      this.$router.push('/')
    }
  },

  mounted: async function () {
    try {
      var response = await CourseService.show(this.$route.params.course_id)
      this.course = response.data.course
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hide {
  display: none;
}

.item {
  border: thin solid rgba(0, 0, 0, 0.12)
}

div {
  font-size: 18px;
}
</style>
