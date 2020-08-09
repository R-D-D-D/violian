<template lang="pug">
  #new-course
    v-stepper(v-model='e1' style="min-height: calc(100vh - 64px;")
      v-stepper-header
        v-stepper-step(:complete='e1 > 1' step='1' color="indigo") Step 1
        v-divider
        v-stepper-step(:complete='e1 > 2' step='2' color="indigo" editable) Step 2
        v-divider
        v-stepper-step(step='3' color="indigo" editable) Step 3
      v-stepper-items
        v-stepper-content.text-center(step='1')
          v-container
            v-form(ref="nameForm")
              v-row.mb-8
                v-col
                  h1.font-weight-bold First, give your course a title

              v-row.mb-16
                v-col
                  v-text-field.mx-auto(label='Name' type='text' v-model='name' :rules="requiredRules" outlined color="indigo" style="width:50vw;")

            v-row.justify-center
              v-col.text-center
                v-btn(color="indigo" @click='goStepTwo' dark)
                  | Continue
                v-btn(to="/course/index") Cancel

        v-stepper-content.text-center(step='2')
          v-container
            v-form(ref="nameForm")
              v-row.mb-8
                v-col
                  h1.font-weight-bold First, give your course a title

              v-row.mb-16
                v-col
                  v-text-field.mx-auto(label='Name' type='text' v-model='name' :rules="requiredRules" outlined color="indigo" style="width:50vw;")

            v-row.justify-center
              v-col.text-center
                v-btn(color="indigo" @click='goStepTwo' dark)
                  | Continue
                v-btn(to="/course/index") Cancel
        v-stepper-content(step='3')
          v-container
            v-form(ref="instrumentForm")
              v-row.mb-8
                v-col
                  h1.font-weight-bold What instrument are you teaching?

              v-row.mb-16
                v-col
                  v-select(label='Instrument' :items="instruments" v-model="instrument" outlined color="indigo" dense)

            v-row.justify-center
              v-col.text-center
                v-btn(color="indigo" @click='goStepTwo' dark)
                  | Continue
                v-btn(to="/course/index") Cancel

</template>

<script>
/* eslint-disable */
import CourseService from '@/services/CourseService'
import LessonService from '@/services/LessonService'
import FileService from '@/services/FileService'
import ExerciseService from '@/services/ExerciseService'
import vexUI from "@/plugins/vex"
import {mapState} from "vuex"

export default {
  name: 'NewCourse',
  data () {
    return {
      e1: 1,
      name: '',
      tagline: '',
      publishNow: false,
      nameRules: [
        v => !!v || 'Title is required',
      ],
      price: '',
      priceRules: [
        v => !!v || "Price is required",
        v => new RegExp(/^\d+(?:\.\d{0,2})$/).test(v) || "Price must be a number with maximum 2 decimal places"
      ],
      description: '',
      languages: ['English', 'Chinese', 'Malay'],
      language: '',
      level: '',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      instrument: '',
      instruments: ['Piano', 'Guitar', 'Drum Set', 'Er Hu', 'Yang Qin', 'French Horn', 'Violin', 'Body Percussion'],
      targetAudiences: [''],
      learningPoints: [''],
      requirements: [''],
      coverPhoto: null,
      previewVideo: null,
      lesson: [0],
      lessons: [{
        name: '',
        duration: '',
        description: '',
        files: [],
        fileDialog: false,
        exercises: [{
          name: '',
          video: null,
          videoPoster: null,
          useScore: true,
          handler: null,
          timeSignature: '4/4',
          bpm: 60,
          numberOfBars: 4,
          melody: [],
          demoStartTime: "0",
          scoreOption: 'vex',
          musicXml: null,
        }]
      }],
      durationRules: [
        v => !!v || "Duration is required",
        v => new RegExp(/^\d+$/).test(v) || "Please input numbers only"
      ],
      demoStartTimeRules: [
        v => !!v || "Demo Start Time is required",
        v => new RegExp(/^\d+$/).test(v) || "Please input numbers only"
      ],
      requiredRules: [
        v => !!v || "This field is required"
      ],
      alphanumricRules: [
        v => new RegExp("^[a-zA-Z0-9 !@#$%^*_(){}-]{0,100}$").test(v) || "You can only input alphanumeric characters",
      ],
      fileRules: [
        files => {
          for (var i = 0; i < files.length; i++) {
            if (files[i].size > 2097152214783648) {
              return 'File cannot be larger than 2GB'
            }
          }
          return true
        }
      ],
      reviewVexHandlers: [],
      time_signatures: ["4/4", "3/4", "2/4", "3/8", "6/8"],
      error: null,
      loading: false,
      
      // dialog
      newFiles: [],

      // options for file CRUD
      options: ['Download']
    }
  },

  computed: mapState(['user']),

  watch: {
    e1: function (val) {
      if (val == 2 && this.lessons[0].handler == null) {
        var div = document.createElement("div")
        div.id = `vexflow-wrapper-0-0`
        var pannel = document.getElementById(`pannel-content-0-0`)
        pannel.appendChild(div)
        this.lessons[0].exercises[0].handler = new vexUI.Handler(div.id, {
          canvasProperties: {
            id: div.id + '-canvas',
            width: window.innerWidth * 5 / 6,
            tabindex: 1
          }
        }).init();
      }
    }
  },

  methods: {
    showFile (event, idx) {
      this.exercise.fileDialog = true
    },

    async newFile (event, idx) {
      if (this.$refs[`fileForm${idx}`][0].validate()) {
        this.exercise.files = this.exercise.files.concat(this.newFiles.map(f => {
          return {
            file: f,
            size: f.size / 1024,
            type: f.type,
            name: f.name
          }
        }))
        this.newFiles = []
        this.exercise.fileDialog = false
      }
    },

    async deleteFile (event, lessonIdx, fileIdx) {
      this.lessons[lessonIdx].files.splice(fileIdx, 1)
    },

    addLearningPoint () {
      this.learningPoints.push('')
    },

    addTargetAudience () {
      this.targetAudiences.push('')
    },

    addRequirement () {
      this.requirements.push('')
    },

    goStepTwo () {
      if (this.$refs.courseForm.validate()) {
        this.e1 = 2
      }
    },

    goStepThree () {
      for (var i = 0; i < this.lessons.length; i++) {
        if (!this.$refs[`lessonForm${i}`][0].validate()) {
          alert('Please fill in name, duration and demo start time for all lessons')
          return
        }
      }
      for (var j = 0; j< this.lessons.length; j++) {
        if (this.lessons[j].useScore && this.lessons[j].scoreOption == 'vex' && this.lessons[j].melody.length == 0 && this.lessons[j].useScore && this.lessons[j].numberOfBars != 0) {
          alert('Please input some notes or choose not to overlay score')
          return
        }
      }
      this.e1 = 3
    },

    go_to_courses () {
      this.$router.push(`/course/index/${this.$store.state.user.id}`)
    },

    async submit () {
      // this.loading = true
      this.error = ''
      try {
        // create course
        var courseFormData = new FormData()
        courseFormData.set('name', this.name)
        courseFormData.set('description', this.description)
        courseFormData.set('language', this.language)
        courseFormData.set('level', this.level)
        courseFormData.set('instrument', this.instrument)
        courseFormData.set('price', Number(this.price))
        courseFormData.set('requirements', this.requirements.join('&'))
        courseFormData.set('targetAudiences', this.targetAudiences.join('&'))
        courseFormData.set('learningPoints', this.learningPoints.join('&'))
        courseFormData.set('tagline', this.tagline)
        courseFormData.set('TutorId', this.user.id)
        courseFormData.set('publishNow', this.publishNow)


        if (this.previewVideo) {
          courseFormData.append('previewVideo', this.previewVideo)
        }
        if (this.coverPhoto) {
          courseFormData.append('coverPhoto', this.coverPhoto)
        }

        const courseResponse = await CourseService.create(courseFormData)

        // create lessons
        for (var i = 0; i < this.lessons.length; i++) {
          var lessonResponse = await LessonService.create({
            name: this.lessons[i].name,
            duration: Number(this.lessons[i].duration),
            description: this.lessons[i].description,
            cid: courseResponse.data.course.id
          })


          // create exercise that belongs to lessons
          var tempLesson = this.lessons[i]
          var formData = new FormData()
          formData.set('name', '')
          formData.set('melody', tempLesson.melody.join('-'))
          formData.set('timeSignature', tempLesson.timeSignature)
          formData.set('bpm', tempLesson.bpm)
          formData.set('lid', lessonResponse.data.lesson.id)
          formData.set('numberOfBars', tempLesson.numberOfBars)
          formData.set('demoStartTime', parseInt(tempLesson.demoStartTime))
          formData.set('useScore', tempLesson.useScore)
          if (tempLesson.useScore) {
            if (tempLesson.scoreOption == 'vex') {
              formData.set('useXml', false)
            } else {
              formData.set('useXml', true)
            }
          }
          if (tempLesson.video) {
            formData.append('video', tempLesson.video)
          }
          if (tempLesson.videoPoster) {
            formData.append('videoPoster', tempLesson.videoPoster)
          }
          if (tempLesson.musicXml) {
            formData.append('musicXml', tempLesson.musicXml)
          }

          await ExerciseService.create(formData)

          // create resources

          for (var j = 0; j < tempLesson.files.length; j++) {
            let f = tempLesson.files[j]
            let formData = new FormData()
            formData.set('lessonId', lessonResponse.data.lesson.id)
            formData.set('name', f.name)
            formData.set('size', parseInt(f.size))
            formData.set('type', f.type)
            formData.append('file', f.file)
            await FileService.create(formData)
          }

        }

        this.$router.push(`/course/show/${courseResponse.data.course.id}`)
      } catch (err) {
        console.log(err)
        this.error = err.response.data.error
      }
    },

    newLesson () {
      this.lessons.push({
        name: '',
        duration: '',
        description: '',
        files: [],
        fileDialog: false,
        exercises: [{
          name: '',
          video: null,
          videoPoster: null,
          useScore: true,
          handler: null,
          timeSignature: '4/4',
          bpm: 60,
          numberOfBars: 4,
          melody: [],
          demoStartTime: "0",
          scoreOption: 'vex',
          musicXml: null,
        }]
      })
      this.lesson.push(this.lessons.length)
    },

    newExercise (event, lessonIdx) {
      this.lessons[lessonIdx].exercises.push({
        name: '',
        video: null,
        videoPoster: null,
        useScore: true,
        handler: null,
        timeSignature: '4/4',
        bpm: 60,
        numberOfBars: 4,
        melody: [],
        demoStartTime: "0",
        scoreOption: 'vex',
        musicXml: null,
      })
    },

    showVex (event, lessonIdx, exerciseIdx) {
      if (this.exercise.handler == null) {
        var div = document.createElement("div")
        div.id = `vexflow-wrapper-${lessonIdx}-${exerciseIdx}`
        var pannel = document.getElementById(`pannel-content-${lessonIdx}-${exerciseIdx}`)
        pannel.appendChild(div)
        this.exercise.handler = new vexUI.Handler(div.id, {
          canvasProperties: {
            id: div.id + '-canvas',
            width: window.innerWidth * 5 / 6,
            tabindex: 1
          }
        }).init();
      }
    },

    changeTimeSignature (event, lessonIdx, exerciseIdx) {
      this.lessons[lessonIdx].exercises[exerciseIdx].handler.setTimeSignature(this.lessons[lessonIdx].exercises[exerciseIdx].timeSignature)
    },

    changeBars (event, lessonIdx, exerciseIdx) {
      console.log(lessonIdx, exerciseIdx)
      this.lessons[lessonIdx].exercises[exerciseIdx].handler.changeNumberOfBars(this.lessons[lessonIdx].exercises[exerciseIdx].numberOfBars, this.lessons[lessonIdx].exercises[exerciseIdx].handler.exportNotes())
    },

    changeMelody (event, lessonIdx, exerciseIdx) {
      this.lessons[lessonIdx].exercises[exerciseIdx].melody = this.lessons[lessonIdx].exercises[exerciseIdx].handler.exportNotes()
    }
  },

  mounted: function () {
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
