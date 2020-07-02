<template lang="pug">
  #new-course
    v-stepper(v-model='e1')
      v-stepper-header
        v-stepper-step(:complete='e1 > 1' step='1' color="indigo" editable) Course Details
        v-divider
        v-stepper-step(:complete='e1 > 2' step='2' color="indigo" editable) Plan the Lessons
        v-divider
        v-stepper-step(step='3' color="indigo" editable) Confirm
      v-stepper-items
        v-stepper-content(step='1')
          panel.mb-5(title="Basic Info" md="8")
            v-card-text
              v-form
                v-row
                  v-col(cols="12" md="4")
                    v-text-field(label='Title' name='title' type='text' v-model='name' :rules="nameRules" solo clearable color="indigo")
                  v-col(cols="12" md="4")
                    v-text-field(label='Price' name='price' prepend-icon='mdi-currency-usd' v-model='price' :rules="priceRules" solo clearable color="indigo")
                  v-col(cols="12" md="4")
                    v-select(label='Language' :items="languages" v-model="language" solo)
                v-row
                  v-col(cols="12")
                    v-textarea(label="Description" auto-grow solo)
                v-row
                  v-col(cols="12" md="4")
                    v-select(label='Level' :items="levels" v-model="level" solo)
          v-btn(color="indigo" @click='e1 = 2' dark)
            | Continue
          v-btn(@click="go_to_courses") Cancel
        v-stepper-content(step='2')
          v-row.justify-center
            v-col(cols="12" md="10")
              v-expansion-panels.mb-5(multiple focusable)
                v-expansion-panel(v-for='(lesson, idx) in lessons' :key='idx' @click="loadVex($event, idx)")
                  v-expansion-panel-header.text-h4 Lesson {{ idx + 1}}: {{ lesson.name }}
                  v-expansion-panel-content
                    v-form
                      v-row
                        v-col(cols="12" md="4")
                          v-text-field(label='Name' name='name' type='text' v-model='lessons[idx].name' :rules="nameRules" solo clearable color="indigo")
                        v-col(cols="12" md="4")
                          v-text-field(label='Duration' name='duration' v-model='lessons[idx].duration' :rules="durationRules" solo clearable color="indigo")
                      v-row
                        v-col(cols="12")
                          v-textarea(label="Description" auto-grow solo v-model='lessons[idx].description')
                      v-row
                        //- v-col(cols="12" md="4")
                        //-   v-file-input(
                        //-     :rules="rules" 
                        //-     accept="image/png, image/jpeg, image/bmp" 
                        //-     placeholder="Choose Explanation Video Poster" 
                        //-     prepend-icon="mdi-image" 
                        //-     label="Video Poster")
                        v-col(cols="12" md="4")
                          v-file-input(
                            accept="video/mp4, video/ogg" 
                            placeholder="Choose Explanation Video" 
                            prepend-icon="mdi-video" 
                            label="Explanation Video")
                        v-col(cols="12" md="4")
                          v-file-input(
                            accept="video/mp4, video/ogg" 
                            placeholder="Choose Explanation Video" 
                            prepend-icon="mdi-video" 
                            label="Demo Video")
                      v-row
                        v-col
                          v-switch(v-model="lessons[idx].useScore" :label="`Overlay score on your demo video: ${lessons[idx].useScore.toString()}`")
                        v-col
                          div(:id="`vexflow-wrapper-${idx}`")
                v-expansion-panel(@click="newLesson" readonly)
                  v-expansion-panel-header.text-h5(disable-icon-rotate) Add Lesson 
                    template(v-slot:actions)
                      v-icon mdi-plus
                  v-expansion-panel-content
          v-btn(color="indigo" @click='e1 = 3' dark)
            | Continue
          v-btn(@click="go_to_courses") Cancel
        v-stepper-content(step='3')
          v-card.mb-12(color='grey lighten-2' height='200px' dark)
          v-btn(color="indigo" @click="submit" dark)
            | Confirm
          v-btn(@click="go_to_courses") Cancel

</template>

<script>
import Panel from '@/components/Panel'
import CourseService from '@/services/CourseService'
import vexUI from "@/plugins/vex"

export default {
  name: 'NewCourse',
  components: {
    'panel': Panel
  },
  data () {
    return {
      e1: 1,
      name: '',
      nameRules: [
        v => !!v || 'Title is required',
      ],
      validation: {
        namePassed: false,
      },
      error: null,
      loading: false,
      price: '',
      priceRules: [
        v => !!v || "Price is required",
        v => new RegExp(/^\d+(?:\.\d{0,2})$/).test(v) || "Price must be a number with maximum 2 decimal places"
      ],
      desription: '',
      language: '',
      languages: ['English', 'Chinese'],
      level: '',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      lessons: [{
        name: '',
        duration: '',
        description: '',
        video: '',
        useScore: true,
        handler: {}
      }],
      durationRules: [
        v => !!v || "Duration is required",
        v => new RegExp(/^\d+$/).test(v) || "Please input numbers only"
      ],
    }
  },
  methods: {
    go_to_courses () {
      this.$router.push(`/course/index/${this.$store.state.user.id}`)
    },

    async submit () {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.error = null
        try {  
          const response = await CourseService.create({
            name: this.name,
            TutorId: this.user.id,
            price: Number(this.price)
          })
          this.$store.dispatch('addCourse', response.data.course)
          this.dialog = false
          this.$router.push(`/course/show/${response.data.course.id}`)
        } catch (err) {
          console.log(err)
        }
      }
    },

    newLesson () {
      this.lessons.push({
        name: '',
        duration: '',
        description: '',
        video: '',
        useScore: true,
        handler: {}
      })
      this.lessons[this.lessons.length - 1].handler = new vexUI.Handler(`vexflow-wrapper-${this.lessons.length - 1}`).init();
    },

    loadVex (event, idx) {
      this.lessons[idx].handler = new vexUI.Handler(`vexflow-wrapper-${idx}`).init();
    }
  },

  // mounted: function () {
  //   this.lessons[0].handler = new vexUI.Handler(`vexflow-wrapper-0`).init();
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
