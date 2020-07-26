<template lang="pug">
v-container
  v-row(v-if="($route.params.lesson_id && lesson) || $route.params.course_id")
    v-col
      v-card.text-left(outlined).mb-12
        v-card-title.display-1 Lesson
        v-divider
        v-card-text
          v-form.mt-5(:ref="`lessonForm`")
            v-row
              v-col(cols="12" md="4")
                v-text-field(label='Name' name='name' type='text' v-model='newLesson.name' :rules="requiredRules" outlined clearable color="indigo" ) Title*
              v-col(cols="12" md="4")
                v-text-field(label='Duration in minutes' name='duration' v-model='newLesson.duration' :rules="durationRules" outlined clearable color="indigo")
            v-row
              v-col(cols="12")
                v-textarea(label="Description" auto-grow v-model='newLesson.description' color="indigo" outlined)
            v-row
              v-col(cols="12" md="6")
                v-file-input(
                  accept="video/mp4, video/ogg" 
                  :placeholder="lesson.videoUrl ? lesson.videoUrl : 'Choose explanation video'" 
                  prepend-icon="mdi-video" 
                  label="Explanation Video"
                  v-model="lesson.video"
                  outlined
                  color="indigo")
              v-col(cols="12" md="6")
                v-file-input(
                  accept="image/*" 
                  :placeholder="lesson.videoPosterUrl ? lesson.videoPosterUrl : 'Choose coverpage for video'" 
                  prepend-icon="mdi-image" 
                  label="Explanation Video Poster"
                  v-model="lesson.videoPoster"
                  outlined
                  color="indigo")
            v-row
              v-col(cols="12" md="6")
                v-file-input(
                  accept="video/mp4, video/ogg" 
                  :placeholder="lesson.demoUrl ? lesson.demoUrl : 'Choose Demo Video'" 
                  prepend-icon="mdi-video"
                  label="Demo Video"
                  v-model="lesson.demo"
                  outlined
                  color="indigo")
              v-col(cols="12" md="6")
                v-file-input(
                  accept="image/*" 
                  :placeholder="lesson.demoPosterUrl ? lesson.demoPosterUrl : 'Choose coverpage for demo video'" 
                  prepend-icon="mdi-image"
                  label="Demo Video Poster"
                  v-model="lesson.demoPoster"
                  outlined
                  color="indigo")
            v-row
              v-col(cols="12" md="6")
                v-switch(v-model="newLesson.useScore" :label="`Overlay score on your demo video`" color="indigo" @change="showVex")
            v-row  
              v-col(cols="12" md="6" v-if="newLesson.useScore")
                v-radio-group(v-model="newLesson.useXml" :mandatory="true")
                  v-radio(label="Upload musicXML file" :value="true" color="indigo")
                  v-radio(label="Design your own score" :value="false" color="indigo")
              v-col(cols="12" md="6" v-if="newLesson.useScore")
                v-text-field(label='Demo Start Time' v-model='newLesson.demoStartTime' clearable color="indigo" prepend-icon="mdi-alarm" persistent-hint hint="At roughly which second did you start playing in demo video" :rules="demoStartTimeRules")
          
          div#optionvex(v-show="!newLesson.useXml && newLesson.useScore")
            v-row
              v-col(id="pannel-content" @click="changeMelody" ref="pannel")
            v-row
              v-col(cols="12" md="6")
                v-subheader.pl-0 No. Bars
                v-slider(v-model='newLesson.numberOfBars' min='0' max='16' thumb-label :thumb-size="24" @change="changeBars" color="indigo" track-color="indigo lighten-3")
              v-col(cols="12" md="6")
                v-subheader.pl-0 BPM
                v-slider(v-model='newLesson.bpm' min='60' max='120' thumb-label :thumb-size="24" color="indigo" track-color="indigo lighten-3")
              v-col(cols="12" md="6")
                v-select(:items="time_signatures" outlined v-model="newLesson.timeSignature" label='Time Signature' @change="changeTimeSignature" color="indigo")
          div#optionxml(v-show="newLesson.useXml && newLesson.useScore")
            v-row
              v-col(cols="12" md="6")
                v-file-input(
                  accept="text/xml, .musicxml" 
                  placeholder="Music XML file" 
                  prepend-icon="mdi-file-document-outline"
                  label="Upload musicxml file"
                  v-model="lesson.musicXml")
            v-row
              v-col(cols="12" md="6")
                v-subheader.pl-0 BPM
                v-slider(v-model='lesson.bpm' min='60' max='120' thumb-label :thumb-size="24" color="indigo" track-color="indigo lighten-3")
  v-row.justify-center
    v-col.text-center
      v-btn(color="indigo" @click='update' :loading="loading" dark)
        | Save
      v-btn(@click='cancel' :disabled="loading") Cancel
</template>

<script>
/* eslint-disable */
import LessonService from '@/services/LessonService'
import ExerciseService from '@/services/ExerciseService'
import vexUI from "@/plugins/vex"

export default {
  name: 'LessonForm',
  data () {
    return {
      newLesson: {
        name: '',
        duration: '',
        description: '',
        video: null,
        videoPoster: null,
        demo: null,
        demoPoster: null,
        useScore: true,
        timeSignature: '4/4',
        bpm: 60,
        numberOfBars: 4,
        melody: [],
        demoStartTime: "0",
        useXml: false,
        musicXml: null
      },
      lesson: null,
      handler: null,
      requiredRules: [
        v => !!v || "This field is required"
      ],
      durationRules: [
        v => !!v || "Duration is required",
        v => new RegExp(/^\d+$/).test(v) || "Please input numbers only"
      ],
      demoStartTimeRules: [
        v => !!v || "Demo Start Time is required",
        v => new RegExp(/^\d+$/).test(v) || "Please input numbers only"
      ],
      time_signatures: ["4/4", "3/4", "2/4", "3/8", "6/8"],
      loading: false,
      error: null,
    }
  },

  methods: {
    showVex () {
      var div = document.createElement("div")
      div.id = `vexflow-wrapper`
      var pannel = document.getElementById(`pannel-content`)
      pannel.appendChild(div)
      this.handler = new vexUI.Handler(div.id, {
        canvasProperties: {
          id: div.id + '-canvas',
          width: window.innerWidth * 5 / 6,
          tabindex: 1
        }
      }).init()
    },
    
    changeTimeSignature () {
      this.handler.setTimeSignature(this.newLesson.timeSignature)
    },

    changeBars () {
      this.handler.changeNumberOfBars(this.newLesson.numberOfBars, this.handler.exportNotes())
    },

    changeMelody () {
      this.newLesson.melody = this.handler.exportNotes()
    },

    async update () {
      this.loading = true
      let lessonResponse = null
      if (this.$route.params.lesson_id) {
        await LessonService.edit({
          id: this.lesson.id,
          name: this.newLesson.name,
          duration: Number(this.newLesson.duration),
          description: this.newLesson.description,
        })

      } else {
        lessonResponse = await LessonService.create({
          name: this.newLesson.name,
          duration: Number(this.newLesson.duration),
          description: this.newLesson.description,
          cid: this.$route.params.course_id
        })
      }

      // create exercise that belongs to lessons
      var tempLesson = this.newLesson
      var formData = new FormData()
      formData.set('name', '')
      formData.set('melody', tempLesson.melody.join('-'))
      formData.set('timeSignature', tempLesson.timeSignature)
      formData.set('bpm', tempLesson.bpm)
      formData.set('numberOfBars', tempLesson.numberOfBars)
      formData.set('demoStartTime', parseInt(tempLesson.demoStartTime))
      formData.set('useScore', tempLesson.useScore)
      if (tempLesson.useScore) {
        if (!tempLesson.useXml) {
          formData.set('useXml', false)
          formData.set('melody', tempLesson.melody.join('-'))
          formData.set('timeSignature', tempLesson.timeSignature)
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

      if (this.$route.params.lesson_id) {
        formData.set('id', this.lesson.Exercises[0].id)
        await ExerciseService.edit(formData)
      } else {
        formData.set('lid', lessonResponse.data.lesson.id)
        await ExerciseService.create(formData)
      }
      this.loading = false
      this.cancel()
    },

    cancel () {
      if (this.$route.params.lesson_id) {
        this.$router.push(`/course/edit/${this.lesson.CourseId}`)
      } else {
        this.$router.push(`/course/edit/${course.id}`)
      }
    }
  },

  mounted: async function () {
    if (this.$route.params.lesson_id) {
      this.lesson = (await LessonService.show(this.$route.params.lesson_id)).data.lesson
      this.newLesson.name = this.lesson.name
      this.newLesson.duration = this.lesson.duration
      this.newLesson.description = this.lesson.description
      this.newLesson.useScore = this.lesson.Exercises[0].useScore
      this.newLesson.useXml = this.lesson.Exercises[0].useXml
      this.newLesson.demoStartTime = this.lesson.Exercises[0].demoStartTime
      if (this.newLesson.useScore) {
        if (!this.newLesson.useXml) {
          this.newLesson.timeSignature = this.lesson.Exercises[0].timeSignature
          this.newLesson.bpm = this.lesson.Exercises[0].bpm
          this.newLesson.numberOfBars = this.lesson.Exercises[0].numberOfBars
          this.newLesson.melody = this.lesson.Exercises[0].melody
          await this.$nextTick()
          var div = document.createElement("div")
          div.id = `vexflow-wrapper`
          console.log(document.getElementById(`pannel-content`))
          var pannel = document.getElementById(`pannel-content`)
          pannel.appendChild(div)
          this.handler = new vexUI.Handler(div.id, {
            canvasProperties: {
              id: div.id + '-canvas',
              width: window.innerWidth * 5 / 6,
              tabindex: 1
            }
          }).init()
        }
      }
    }
  }
}
</script>

<style>
</style>