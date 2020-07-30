<template lang="pug">
v-container
  v-row(v-if="($route.params.lesson_id && lesson) || $route.params.course_id")
    v-col
      v-card.text-left(outlined).mb-12
        v-card-title.display-1.px-10.font-weight-bold Lesson
          v-spacer
          v-btn(outlined color='indigo' right @click="deleteLesson")
            v-icon(color="indigo") mdi-trash-can-outline
        v-divider
        v-card-text.px-10
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
                  :placeholder="lesson && lesson.Exercises[0].videoUrl ? lesson.Exercises[0].videoUrl.split('/')[6] : 'Choose explanation video'" 
                  prepend-icon="mdi-video" 
                  label="Explanation Video"
                  v-model="newLesson.video"
                  outlined
                  color="indigo")
              v-col(cols="12" md="6")
                v-file-input(
                  accept="image/*" 
                  :placeholder="lesson && lesson.Exercises[0].videoPosterUrl ? lesson.Exercises[0].videoPosterUrl.split('/')[6] : 'Choose coverpage for video'" 
                  prepend-icon="mdi-image" 
                  label="Explanation Video Poster"
                  v-model="newLesson.videoPoster"
                  outlined
                  color="indigo")
            v-row
              v-col(cols="12" md="6")
                v-file-input(
                  accept="video/mp4, video/ogg" 
                  :placeholder="lesson && lesson.Exercises[0].demoUrl ? lesson.Exercises[0].demoUrl.split('/')[6] : 'Choose Demo Video'" 
                  prepend-icon="mdi-video"
                  label="Demo Video"
                  v-model="newLesson.demo"
                  outlined
                  color="indigo")
              v-col(cols="12" md="6")
                v-file-input(
                  accept="image/*" 
                  :placeholder="lesson && lesson.Exercises[0].demoPosterUrl ? lesson.Exercises[0].demoPosterUrl.split('/')[6] : 'Choose coverpage for demo video'" 
                  prepend-icon="mdi-image"
                  label="Demo Video Poster"
                  v-model="newLesson.demoPoster"
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
                  v-model="newLesson.musicXml")
            v-row
              v-col(cols="12" md="6")
                v-subheader.pl-0 BPM
                v-slider(v-model='newLesson.bpm' min='60' max='120' thumb-label :thumb-size="24" color="indigo" track-color="indigo lighten-3")

          v-row(v-if="currentFolder")
            v-col(cols="12")
              h1 Resources
            v-col.py-0(cols="12")
              v-breadcrumbs.px-0.py-2(:items="currentFolder.path.split('/')")
                template(v-slot:divider)
                  v-icon mdi-chevron-right
                template(v-slot:item="{ item }")
                  v-breadcrumbs-item
                    v-btn.px-2(@click="navigateTo($event, item)" text color="indigo" style="font-size:1rem !important;") {{ item }}

            v-col(cols="12")
              v-list.py-0
                v-list-item.pl-2
                  v-list-item-icon
                    v-icon 
                  v-list-item-content
                    v-list-item-title Name
                  v-spacer
                  v-spacer
                  v-list-item-content
                    v-list-item-title File Type
                  v-list-item-content
                    v-list-item-title File Size
                  v-list-item-content
                    v-list-item-title Last Updated 
                v-divider
                template(v-for="(folder, idx) in children")
                  v-list-item.pl-2(@click="navigateTo($event, folder)")
                    v-list-item-icon
                      v-icon mdi-folder
                    v-list-item-content
                      v-list-item-title(v-text="folder.path.split('/').slice(-2)[0]")
                    v-spacer
                    v-spacer
                    v-list-item-content
                      v-list-item-title folder
                    v-list-item-content
                      v-list-item-title {{ folder.size > 1024 ? (folder.size > 1048576 ? `${(folder.size / 1048576).toFixed(2)} GB` : `${(folder.size / 1024).toFixed(2)} MB`) : `${folder.size} KB`}}
                    v-list-item-content
                      v-list-item-title {{ new Date(folder.updatedAt).toLocaleString([], { year: 'numeric', month: 'numeric', day:'numeric'}) }}
                  v-divider
                template(v-for="(file, idx) in currentFolder.Files")
                  v-list-item.pl-2(:href="file.url" download)
                    v-list-item-icon(v-if="file.type.includes('image')")
                      v-icon mdi-image
                    v-list-item-icon(v-else-if="file.type.includes('video')")
                      v-icon mdi-video
                    v-list-item-icon(v-else-if="file.type.includes('pdf')")
                      v-icon mdi-file-pdf
                    v-list-item-icon(v-else)
                      v-icon mdi-file
                    v-list-item-content
                      v-list-item-title(v-text='file.name')
                    v-spacer
                    v-spacer
                    v-list-item-content
                      v-list-item-title(v-text='file.type')
                    v-list-item-content
                      v-list-item-title {{ file.size > 1024 ? (file.size > 1048576 ? `${(file.size / 1048576).toFixed(2)} GB` : `${(file.size / 1024).toFixed(2)} MB`) : `${file.size} KB`}}
                    v-list-item-content
                      v-list-item-title {{ new Date(file.updatedAt).toLocaleString([], { year: 'numeric', month: 'numeric', day:'numeric'}) }}
                  v-divider
            v-col.text-center(cols="12")
              v-btn.ma-2.white--text(color='indigo' @click="")
                | Upload
                v-icon(right dark) mdi-cloud-upload
            
      </v-breadcrumbs-item>

  
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
import FolderService from '@/services/FolderService'
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
        musicXml: null,
        folders: []
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
      currentFolder: null,
      loading: false,
      error: null,
    }
  },

  watch: {
    'newLesson.demoPoster' (val) {
      console.log(val)
    }
  },

  computed: {
    children () {
      let currPath = this.currentFolder.path
      return this.newLesson.folders.filter(folder => folder.path.includes(currPath) && folder.path.split(currPath).length == 2 && folder.path.split(currPath)[1] != '')
    }
  },

  methods: {
    showVex () {
      if (this.handler == null) {
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
      }
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

    navigateTo (event, folder) {
      console.log(folder.relativePath)
      let arr = folder.relativePath.split('/')
      let folderToBePushed = null
      for (let i = 0; i < arr.length - 1; i++) {

      }
    },

    async update () {
      if (!this.$refs.lessonForm.validate())
        return
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

      console.log(formData)
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
        this.$router.push(`/course/edit/${this.$route.params.course_id}`)
      }
    },

    async deleteLesson () {
      await LessonService.delete(this.lesson.id)
      this.$router.push(`/course/edit/${this.lesson.CourseId}`)
    }
  },

  mounted: async function () {
    if (this.$route.params.lesson_id) {
      this.lesson = (await LessonService.show(this.$route.params.lesson_id)).data.lesson

      this.newLesson.folders = (await FolderService.list(this.lesson.id)).data.folders
      this.currentFolder = this.newLesson.folders.find(folder => folder.path == 'Resources/')

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
          this.newLesson.melody = this.lesson.Exercises[0].melody.split('-')
          await this.$nextTick()
          var div = document.createElement("div")
          div.id = `vexflow-wrapper`
          var pannel = document.getElementById(`pannel-content`)
          pannel.appendChild(div)
          this.handler = new vexUI.Handler(div.id, {
            numberOfStaves: this.newLesson.numberOfBars,
            canvasProperties: {
              id: div.id + '-canvas',
              width: window.innerWidth * 5 / 6,
              tabindex: 1
            }
          }).init()
          this.handler.importNotes(this.newLesson.melody, this.newLesson.timeSignature)
        }
      }
    } else {
      await this.$nextTick()
      var div = document.createElement("div")
      div.id = `vexflow-wrapper`
      var pannel = document.getElementById(`pannel-content`)
      pannel.appendChild(div)
      this.handler = new vexUI.Handler(div.id, {
        numberOfStaves: this.newLesson.numberOfBars,
        canvasProperties: {
          id: div.id + '-canvas',
          width: window.innerWidth * 5 / 6,
          tabindex: 1
        }
      }).init()
    }
  }
}
</script>

<style scoped>
</style>