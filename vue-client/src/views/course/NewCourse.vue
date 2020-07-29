<template lang="pug">
  #new-course
    v-stepper(v-model='e1')
      v-stepper-header
        v-stepper-step(:complete='e1 > 1' step='1' color="indigo") Course Details
        v-divider
        v-stepper-step(:complete='e1 > 2' step='2' color="indigo") Plan the Lessons
        v-divider
        v-stepper-step(step='3' color="indigo") Review and Confirm
      v-stepper-items
        v-stepper-content(step='1')
          v-container
            v-row.justify-center
              v-col(cols="12")
                v-card.text-left(outlined).mb-12
                  v-card-title.px-10.display-1 Course Info
                  v-divider
                  v-card-text.px-10
                    v-form(ref="courseForm")
                      v-row
                        v-col(cols="12" md="4")
                          v-text-field(label='Title*' name='title' type='text' v-model='name' outlined clearable color="indigo")
                        v-col(cols="12" md="4")
                          v-text-field(label='Price*' name='price' prepend-icon='mdi-currency-usd' v-model='price' :rules="priceRules" outlined clearable color="indigo")
                        v-col(cols="12" md="4")
                          v-text-field(label='Tagline' name='tagline' v-model='tagline' outlined clearable color="indigo")
                      v-row
                        v-col(cols="12")
                          v-textarea(label="Description" auto-grow outlined v-model="description" color="indigo")
                      v-row
                        v-col(cols="12" md="4")
                          v-select(label='Level' :items="levels" v-model="level" outlined color="indigo")
                        v-col(cols="12" md="4")
                          v-select(label='Instrument' :items="instruments" v-model="instrument" outlined color="indigo")
                        v-col(cols="12" md="4")
                          v-select(label='Language' :items="languages" v-model="language" outlined color="indigo")
                      
                      v-row
                        v-col(cols="12" md="6")
                          v-file-input(
                            accept="video/mp4, video/ogg" 
                            placeholder="Upload a preview video, if none is supplied, the first lesson will be displayed as preview video" 
                            prepend-icon="mdi-video"
                            label="Preview Video"
                            v-model="previewVideo"
                            outlined
                            color="indigo")

                        v-col(cols="12" md="6")
                          v-file-input(
                            accept="image/*" 
                            placeholder="Choose coverpage for your course" 
                            prepend-icon="mdi-image"
                            label="Cover Photo"
                            v-model="coverPhoto"
                            outlined
                            :rules="requiredRules"
                            color="indigo")
                      
                      v-row
                        v-col(cols="12")
                          div(style="font-size: 16px;") What will your students learn from the course?
                        v-col.py-1(cols="12" v-for="(learningPoint, idx) in learningPoints")
                          v-text-field(color="indigo" label='Example: How to use pen tool in Photoshop' name='tagline' v-model='learningPoints[idx]' outlined clearable dense hide-details :rules="alphanumricRules")
                        v-col(cols="12")
                          v-btn(@click="addLearningPoint" color="indigo" text) + Add an answer
                      
                      v-row
                        v-col(cols="12")
                          div(style="font-size: 16px;") Who are this course for?
                        v-col.py-1(cols="12" v-for="(targetAudience, idx) in targetAudiences")
                          v-text-field(color="indigo" label='Example: Kids 6-8 years old' name='tagline' v-model='targetAudiences[idx]' outlined clearable dense hide-details :rules="alphanumricRules")
                        v-col(cols="12")
                          v-btn(@click="addTargetAudience" color="indigo" text) + Add an answer
                      
                      v-row
                        v-col(cols="12")
                          div(style="font-size: 18px;") What are the requirements?
                        v-col.py-1(cols="12" v-for="(requirement, idx) in requirements")
                          v-text-field(color="indigo" label='Example: Photoshop software' name='tagline' v-model='requirements[idx]' outlined clearable dense hide-details :rules="alphanumricRules")
                        v-col(cols="12")
                          v-btn(@click="addRequirement" color="indigo" text) + Add an answer
              
            v-row.justify-center
              v-col.text-center
                v-btn(color="indigo" @click='goStepTwo' dark)
                  | Continue
                v-btn(to="/course/index") Cancel
        v-stepper-content(step='2')
          v-container
            v-row.justify-center
              v-col(cols="12")
                v-expansion-panels.mb-5(multiple focusable v-model="lesson")
                  v-expansion-panel(v-for='(lesson, idx) in lessons' :key='idx' @click="")
                    v-expansion-panel-header.text-h4.px-10 Lesson {{ idx + 1}}: {{ lesson.name }}
                    v-expansion-panel-content.px-10
                      v-form.mt-5(:ref="`lessonForm${idx}`")
                        v-row
                          v-col(cols="12" md="4")
                            v-text-field(label='Name' name='name' type='text' v-model='lessons[idx].name' :rules="requiredRules" outlined clearable color="indigo" ) Title*
                          v-col(cols="12" md="4")
                            v-text-field(label='Duration in minutes' name='duration' v-model='lessons[idx].duration' :rules="durationRules" outlined clearable color="indigo")
                        v-row
                          v-col(cols="12")
                            v-textarea(label="Description" auto-grow v-model='lessons[idx].description' color="indigo" outlined)
                        v-row
                          v-col(cols="12" md="6")
                            v-file-input(
                              accept="video/mp4, video/ogg" 
                              placeholder="Choose Explanation Video" 
                              prepend-icon="mdi-video" 
                              label="Explanation Video"
                              v-model="lessons[idx].video"
                              outlined
                              color="indigo")
                          v-col(cols="12" md="6")
                            v-file-input(
                              accept="image/*" 
                              placeholder="Choose coverpage for video" 
                              prepend-icon="mdi-image" 
                              label="Explanation Video Poster"
                              v-model="lessons[idx].videoPoster"
                              outlined
                              color="indigo")
                        v-row
                          v-col(cols="12" md="6")
                            v-file-input(
                              accept="video/mp4, video/ogg" 
                              placeholder="Choose Demo Video" 
                              prepend-icon="mdi-video"
                              label="Demo Video"
                              v-model="lessons[idx].demo"
                              outlined
                              color="indigo")
                          v-col(cols="12" md="6")
                            v-file-input(
                              accept="image/*" 
                              placeholder="Choose coverpage for demo video" 
                              prepend-icon="mdi-image"
                              label="Demo Video Poster"
                              v-model="lessons[idx].demoPoster"
                              outlined
                              color="indigo")
                        v-row
                          v-col(cols="12" md="6")
                            v-switch(v-model="lessons[idx].useScore" :label="`Overlay score on your demo video`" @change="showVex($event, idx)" color="indigo")
                        v-row  
                          v-col(cols="12" md="6" v-if="lessons[idx].useScore")
                            v-radio-group(v-model="lessons[idx].scoreOption" :mandatory="true")
                              v-radio(label="Upload musicXML file" value="xml" color="indigo")
                              v-radio(label="Design your own score" value="vex" color="indigo")
                          v-col(cols="12" md="6" v-if="lessons[idx].useScore")
                            v-text-field(label='Demo Start Time' v-model='lessons[idx].demoStartTime' clearable color="indigo" prepend-icon="mdi-alarm" persistent-hint hint="At roughly which second did you start playing in demo video" :rules="demoStartTimeRules")
                      
                      div#optionvex(v-show="(lessons[idx].scoreOption == 'vex' && lessons[idx].useScore)")
                        v-row
                          v-col(:id="`pannel-content-${idx}`" @click="changeMelody($event, idx)")
                        v-row
                          v-col(cols="12" md="6")
                            v-subheader.pl-0 No. Bars
                            v-slider(v-model='lessons[idx].numberOfBars' min='0' max='16' thumb-label :thumb-size="24" @change="changeBars($event, idx)" color="indigo" track-color="indigo lighten-3")
                          v-col(cols="12" md="6")
                            v-subheader.pl-0 BPM
                            v-slider(v-model='lessons[idx].bpm' min='60' max='120' thumb-label :thumb-size="24" color="indigo" track-color="indigo lighten-3")
                          v-col(cols="12" md="6")
                            v-select(:items="time_signatures" outlined v-model="lessons[idx].timeSignature" label='Time Signature' @change="changeTimeSignature($event, idx)" color="indigo")
                      div#optionxml(v-show="(lessons[idx].scoreOption == 'xml' && lessons[idx].useScore)")
                        v-row
                          v-col(cols="12" md="6")
                            v-file-input(
                              accept="text/xml, .musicxml" 
                              placeholder="Music XML file" 
                              prepend-icon="mdi-file-document-outline"
                              label="Upload musicxml file"
                              v-model="lessons[idx].musicXml")
                        v-row
                          v-col(cols="12" md="6")
                            v-subheader.pl-0 BPM
                            v-slider(v-model='lessons[idx].bpm' min='60' max='120' thumb-label :thumb-size="24")


                  v-expansion-panel(@click="newLesson" readonly)
                    v-expansion-panel-header.text-h5(disable-icon-rotate) Add Lesson 
                      template(v-slot:actions)
                        v-icon mdi-plus

            v-row.justify-center
              v-col.text-center
                v-btn(color="indigo" @click='goStepThree' dark)
                  | Continue
                v-btn(to="/course/index") Cancel
        v-stepper-content(step='3')
          v-container
            v-row.justify-center
              v-col(cols="12")
                v-card.text-left(outlined).mb-12
                  v-card-title.display-1.px-10 Course Info
                    v-spacer
                    v-btn(outlined color='indigo' right @click='e1 = 1')
                      v-icon(color="indigo") mdi-pencil
                  v-divider
                  v-card-text.px-10
                    v-row
                      v-col(cols="12" md="4")
                        strong Title: 
                        | {{ name }}
                      v-col(cols="12" md="4")
                        strong Price: 
                        | {{ price }}
                      v-col(cols="12" md="4")
                        strong Tagline: 
                        | {{ tagline }}
                    v-row
                      v-col(cols="12")
                        strong Description: 
                        | {{ description }}
                    v-row
                      v-col(cols="12" md="4")
                        strong Level: 
                        | {{ level }}
                      v-col(cols="12" md="4")
                        strong Instrument: 
                        | {{ instrument }}
                      v-col(cols="12" md="4")
                        strong Language: 
                        | {{ language }}
                    v-row
                      v-col(cols="12" md="4" v-if="previewVideo")
                        strong Preview video: 
                        | {{ previewVideo.name }}
                      v-col(cols="12" md="4" v-if="coverPhoto")
                        strong Cover photo: 
                        | {{ coverPhoto.name }}
                    
                    v-row
                      v-col(cols="12")
                        strong What your student will learn:
                      v-col(v-for="learningPoint in learningPoints" cols="12")
                        strong 
                        | {{ learningPoint }}

                    v-row
                      v-col(cols="12")
                        strong Who are this course for?
                      v-col(cols="12" v-for="targetAudience in targetAudiences")
                        p {{ targetAudience }}

                    v-row
                      v-col(cols="12")
                        strong What are the requirements?
                      v-col(cols="12" v-for="requirement in requirements")
                        p {{ requirement }}
            
            v-row.justify-center.mt-5
              v-col(cols="12")
                v-card.text-left(outlined).mb-12
                  v-card-title.display-1.px-10 Lessons
                    v-spacer
                    v-btn(outlined color='indigo' right @click='e1 = 2')
                      v-icon(color="indigo") mdi-pencil
                  v-divider
                  v-card-text.px-10(v-for="(lesson, idx) in lessons")
                    v-row
                      v-col(cols="12" md="4")
                        strong Name: 
                        | {{ lesson.name }}
                      v-col(cols="12" md="4")
                        strong Duration: 
                        | {{ lesson.duration }}
                    v-row
                      v-col(cols="12")
                        strong Description: 
                        | {{ lesson.description }}
                    v-row(v-if="lesson.video && lesson.videoPoster")
                      v-col(cols="12" md="6")
                        strong Explanation Video: 
                        | {{ lesson.video.name }}
                      v-col(cols="12" md="6")
                        strong Video Poster: 
                        | {{ lesson.videoPoster.name }}
                    v-row(v-if="lesson.demo && lesson.demoPoster")
                      v-col(cols="12" md="6")
                        strong Demo Video: 
                        | {{ lesson.demo.name }}
                      v-col(cols="12" md="6")
                        strong Demo Poster: 
                        | {{ lesson.demoPoster.name }}
                    v-row(v-show="lesson.useScore && !lesson.useXml")
                      v-col(cols="12")
                        div(:id="`vexflow-review-wrapper-${idx}`")
                      v-col(cols="12" md="4")
                        strong BPM: {{ lesson.bpm }}
                      v-col(cols="12" md="4")
                        strong Number of Bars: 
                        | {{ lesson.numberOfBars }}
                    v-row(v-if="lesson.useScore && lesson.useXml")
                      v-col(cols="12" md="4")
                        strong MusicXML file: 
                        | {{ lesson.musicXml.name }}

                    v-row(v-if="lesson.useScore && lesson.useXml")
                      v-col
                        strong MusicXML file: 
                        | {{ lesson.musicXml.name }}


            v-row.justify-center
              v-col.text-center
                v-btn(color="indigo" @click="submit" dark :loading="loading")
                  | Confirm
                v-btn(to="/course/index" :disabled="loading") Cancel
            v-row
              v-col
                p.error {{ error }}

</template>

<script>
import CourseService from '@/services/CourseService'
import LessonService from '@/services/LessonService'
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
      nameRules: [
        v => !!v || 'Title is required',
      ],
      price: '',
      priceRules: [
        v => !!v || "Price is required",
        v => new RegExp(/^\d+(?:\.\d{0,2})$/).test(v) || "Price must be a number with maximum 2 decimal places"
      ],
      description: '',
      language: '',
      languages: ['English', 'Chinese'],
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
        video: null,
        videoPoster: null,
        demo: null,
        demoPoster: null,
        useScore: true,
        handler: null,
        timeSignature: '4/4',
        bpm: 60,
        numberOfBars: 4,
        melody: [],
        demoStartTime: "0",
        scoreOption: 'vex',
        musicXml: null
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
      reviewVexHandlers: [],
      time_signatures: ["4/4", "3/4", "2/4", "3/8", "6/8"],
      error: null,
      loading: false,
    }
  },

  computed: mapState(['user']),

  watch: {
    e1: function (val) {
      if (val == 2 && this.lessons[0].handler == null) {
        var div = document.createElement("div")
        div.id = `vexflow-wrapper-0`
        var pannel = document.getElementById(`pannel-content-0`)
        pannel.appendChild(div)
        this.lessons[0].handler = new vexUI.Handler(div.id, {
          canvasProperties: {
            id: div.id + '-canvas',
            width: window.innerWidth * 5 / 6,
            tabindex: 1
          }
        }).init();
      } else if (val == 3) {
        if (this.reviewVexHandlers.length == 0) {
          // first time coming
          for (var i = 0; i < this.lessons.length; i++) {
            const handler = new vexUI.Handler(`vexflow-review-wrapper-${i}`, {
              canEdit: false,
              numberOfStaves: this.lessons[i].numberOfBars,
              canvasProperties: {
                id: `vexflow-review-wrapper-${i}` + '-canvas',
                width: window.innerWidth * 5 / 6,
                tabindex: 1
              }
            }).init();
            handler.setTimeSignature(this.lessons[i].timeSignature)
            if (this.lessons[i].melody.length > 0) {
              handler.importNotes(this.lessons[i].melody, this.lessons[i].timeSignature)
            }
            this.reviewVexHandlers.push(handler)
            if (!this.lessons[i].useScore)
              document.getElementById(`vexflow-review-wrapper-${i}`).classList.add("hide")
          }
        } else {
          for (var j = 0; j < this.lessons.length; j++) {
            if (this.lessons[j].useScore) {
              this.reviewVexHandlers[j].setTimeSignature(this.lessons[j].timeSignature)
              this.reviewVexHandlers[j].importNotes(this.lessons[j].melody, this.lessons[j].timeSignature)
            }
          }
        }
      }
    }
  },

  methods: {
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
      this.loading = true
      this.error = ''
      try {
        // create course
        var courseFormData = new FormData()
        courseFormData.set('name', this.name)
        courseFormData.set('description', this.description)
        courseFormData.set('language', this.langauge)
        courseFormData.set('level', this.level)
        courseFormData.set('instrument', this.instrument)
        courseFormData.set('price', Number(this.price))
        courseFormData.set('requirements', this.requirements.join('&'))
        courseFormData.set('targetAudiences', this.targetAudiences.join('&'))
        courseFormData.set('learningPoints', this.learningPoints.join('&'))
        courseFormData.set('tagline', this.tagline)
        courseFormData.set('TutorId', this.user.id)

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
          if (tempLesson.demo) {
            formData.append('demo', tempLesson.demo)
          }
          if (tempLesson.demoPoster) {
            formData.append('demoPoster', tempLesson.demoPoster)
          }
          if (tempLesson.musicXml) {
            formData.append('musicXml', tempLesson.musicXml)
          }

          await ExerciseService.create(formData)

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
        video: null,
        demoVideo: null,
        useScore: false,
        handler: null,
        timeSignature: '4/4',
        bpm: 60,
        numberOfBars: 4,
        melody: [],
        demoStartTime: "0"
      })
      this.lesson.push(this.lessons.length)
    },

    showVex (event, idx) {
      if (this.lessons[idx].handler == null) {
        var div = document.createElement("div")
        div.id = `vexflow-wrapper-${idx}`
        var pannel = document.getElementById(`pannel-content-${idx}`)
        pannel.appendChild(div)
        this.lessons[idx].handler = new vexUI.Handler(div.id, {
          canvasProperties: {
            id: div.id + '-canvas',
            width: window.innerWidth * 5 / 6,
            tabindex: 1
          }
        }).init();
      }
    },

    changeTimeSignature (event, idx) {
      this.lessons[idx].handler.setTimeSignature(this.lessons[idx].timeSignature)
    },

    changeBars (event, idx) {
      this.lessons[idx].handler.changeNumberOfBars(this.lessons[idx].numberOfBars, this.lessons[idx].handler.exportNotes())
    },

    changeMelody (event, idx) {
      this.lessons[idx].melody = this.lessons[idx].handler.exportNotes()
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
