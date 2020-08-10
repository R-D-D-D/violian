<template lang="pug">
  #new-course
    v-stepper(v-model='e1' style="min-height: calc(100vh - 64px;")
      v-stepper-header
        v-stepper-step(:complete='e1 > 1' step='1' color="indigo") Step 1
        v-divider
        v-stepper-step(:complete='e1 > 2' step='2' color="indigo") Step 2
        v-divider
        v-stepper-step(step='3' color="indigo") Step 3
      v-stepper-items
        v-stepper-content.text-center(step='1')
          v-container
            v-form(ref="nameForm" @submit.prevent="goStepTwo")
              v-row.mb-8
                v-col
                  h1.font-weight-bold First, give your course a title

              v-row.mb-16
                v-col
                  v-text-field.mx-auto(label='Name' type='text' v-model='name' :rules="requiredRules" outlined color="indigo" style="width:60vw;")

            v-row.justify-center
              v-col.text-center
                v-btn(color="indigo" @click='goStepTwo' dark)
                  | Continue
                v-btn(to="/course/index") Cancel

        v-stepper-content.text-center(step='2')
          v-container
            v-form(ref="instrumentForm" @submit.prevent="goStepThree")
              v-row.mb-8
                v-col
                  h1.font-weight-bold What instrument are you teaching?

              v-row.mb-16
                v-col
                  v-select.mx-auto(label='Instrument' :items="instruments" v-model="instrument" outlined color="indigo" style="width:60vw;")

            v-row.justify-center
              v-col.text-center
                v-btn(color="indigo" @click='goStepThree' dark)
                  | Continue
                v-btn(to="/course/index") Cancel
        v-stepper-content.text-center(step='3')
          v-container
            v-form(ref="languageForm" @submite.prevent="submit")
              v-row.mb-8
                v-col
                  h1.font-weight-bold What language do you use?

              v-row.mb-16
                v-col
                  v-select.mx-auto(label='Language' :items="languages" v-model="language" outlined color="indigo" style="width:60vw;")

            v-row.justify-center
              v-col.text-center
                v-btn(color="indigo" @click='submit' dark)
                  | Create Course
                v-btn(to="/course/index") Cancel

</template>

<script>
/* eslint-disable */
import CourseService from '@/services/CourseService'
import {mapState} from "vuex"

export default {
  name: 'NewCourse',
  data () {
    return {
      e1: 1,
      name: '',
      publishNow: false,
      nameRules: [
        v => !!v || 'Title is required',
      ],
      languages: ['English', 'Chinese', 'Malay'],
      language: '',
      instrument: '',
      instruments: ['Piano', 'Guitar', 'Drum Set', 'Er Hu', 'Yang Qin', 'French Horn', 'Violin', 'Body Percussion'],

      requiredRules: [
        v => !!v || "This field is required"
      ]
    }
  },

  computed: mapState(['user']),

  methods: {
 
    goStepTwo () {
      if (this.$refs.nameForm.validate()) {
        this.e1 = 2
      }
    },

    goStepThree () {
      if (this.$refs.instrumentForm.validate()) {
        this.e1 = 2
      }
      this.e1 = 3
    },


    async submit () {
      // this.loading = true
      this.error = ''
      try {
        if (this.$refs.languageForm.validate()) {
          // create course
          var courseFormData = new FormData()
          courseFormData.set('name', this.name)
          courseFormData.set('language', this.language)
          courseFormData.set('instrument', this.instrument)
          courseFormData.set('TutorId', this.user.id)
          courseFormData.set('publishNow', this.publishNow)

          this.$router.push(`/course/edit/${courseResponse.data.course.id}`)
        }
      } catch (err) {
        console.log(err)
        this.error = err.response.data.error
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hide {
  display: none;
}

div {
  font-size: 18px;
}
</style>
