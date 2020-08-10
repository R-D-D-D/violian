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
          v-form(:ref="`lessonForm`")
            v-row
              v-col.pb-0(cols="12" md="4")
                v-text-field(dense label='Name' name='name' type='text' v-model='newLesson.name' :rules="requiredRules" outlined color="indigo" ) Title*
              v-col.pb-0(cols="12" md="4")
                v-text-field(dense label='Duration in minutes' name='duration' v-model='newLesson.duration' :rules="durationRules" outlined color="indigo")
            v-row
              v-col.pb-0(cols="12")
                v-textarea(dense label="Description" auto-grow v-model='newLesson.description' color="indigo" outlined)
                            
          v-row
            v-col(cols="12")         
              v-expansion-panels.mb-5(multiple focusable v-model="openedExercise")
                v-expansion-panel(v-for="(exercise, exerciseIdx) in newLesson.exercises" :key='exerciseIdx' @click="")
                  v-expansion-panel-header.text-h5 Video Content {{ exerciseIdx + 1 }}: {{ exercise.name }}
                  v-expansion-panel-content.px-6
                    v-form(:ref="`exerciseForm-${exerciseIdx}`")
                      v-row
                        v-col(cols="12" md="6")
                          v-text-field(hide-details label='Name' v-model='exercise.name' color="indigo" outlined dense)
                      v-row
                        v-col(cols="12" md="6")
                          v-file-input(
                            accept="video/mp4, video/ogg"
                            :placeholder="exercise.videoUrl ? exercise.videoUrl.split('/')[6] : 'Choose explanation video'" 
                            prepend-icon="mdi-video" 
                            label="Explanation Video"
                            v-model="exercise.video"
                            outlined
                            color="indigo"
                            dense
                            hide-details)
                        v-col(cols="12" md="6")
                          v-file-input(
                            accept="image/*" 
                            :placeholder="exercise.videoPosterUrl ? exercise.videoPosterUrl.split('/')[6] : 'Choose coverpage for video'" 
                            prepend-icon="mdi-image" 
                            label="Explanation Video Poster"
                            v-model="exercise.videoPoster"
                            outlined
                            color="indigo"
                            dense
                            hide-details)

                      v-row
                        v-col.pb-0(cols="12" md="6")
                          v-switch.ma-0(v-model="exercise.useScore" :label="`Overlay score on your video`" color="indigo" @change="showVex($event, exerciseIdx)" dense hide-details)
                      v-row  
                        v-col.pb-0(cols="12" md="6" v-if="exercise.useScore")
                          v-radio-group(v-model="exercise.useXml" :mandatory="true")
                            v-radio(label="Upload musicXML file" :value="true" color="indigo")
                            v-radio(label="Design your own score" :value="false" color="indigo")
                        v-col.pb-0(cols="12" md="6" v-if="exercise.useScore")
                          v-text-field(label='Demo Start Time' v-model='exercise.demoStartTime' color="indigo" prepend-icon="mdi-alarm" persistent-hint hint="At roughly which second did you start playing in demo video" :rules="demoStartTimeRules")
                    
                      div(v-show="!exercise.useXml && exercise.useScore")
                        v-row
                          v-col.pa-0(:id="`pannel-content-${exerciseIdx}`" @click="changeMelody($event, exerciseIdx)")
                        v-row
                          v-col.pt-0(cols="12" md="6")
                            div.pl-0 No. Bars:   {{ exercise.numberOfBars }}
                            v-slider(v-model='exercise.numberOfBars' min='0' max='16' thumb-label :thumb-size="24" @change="changeBars($event, lessonIdx, exerciseIdx)" color="indigo" track-color="indigo lighten-3" hide-details)
                          v-col.pt-0(cols="12" md="6")
                            div.pl-0 BPM:   {{ exercise.bpm }}
                            v-slider(v-model='exercise.bpm' min='60' max='120' thumb-label :thumb-size="24" color="indigo" track-color="indigo lighten-3" hide-details)
                          v-col(cols="12" md="6")
                            v-select(dense :items="time_signatures" outlined v-model="exercise.timeSignature" label='Time Signature' @change="changeTimeSignature($event, lessonIdx, exerciseIdx)" color="indigo")
                      div(v-show="exercise.useXml && exercise.useScore")
                        v-row
                          v-col(cols="12" md="6")
                            v-file-input(
                              accept="text/xml, .musicxml" 
                              placeholder="Music XML file" 
                              prepend-icon="mdi-file-document-outline"
                              label="Upload musicxml file"
                              v-model="exercise.musicXml"
                              outlined
                              dense)
                          v-col.pt-0(cols="12" md="6")
                            div.pl-0 BPM:   {{ exercise.bpm }}
                            v-slider(v-model='exercise.bpm' min='60' max='120' thumb-label :thumb-size="24" color="indigo" track-color="indigo lighten-3" hide-details)


                v-expansion-panel(@click="newExercise" readonly)
                  v-expansion-panel-header.text-h5(disable-icon-rotate) Add Content
                    template(v-slot:actions)
                      v-icon mdi-plus
          v-row
            v-col(cols="12")
              h1 Resources
            
          v-divider

          v-row
            v-col.pt-0(cols="12")
              v-list.py-0
                v-list-item.pl-2
                  v-list-item-icon
                    v-icon 
                  v-list-item-content.file-name
                    v-list-item-title Name
                  v-spacer
                  v-spacer
                  v-list-item-content
                    v-list-item-title Type
                  v-list-item-content
                    v-list-item-title Size
                  v-list-item-action.ml-0
                    v-menu(bottom left)
                      template(v-slot:activator='{ on, attrs }')
                        v-btn(icon v-bind='attrs' v-on='on')
                          v-icon mdi-dots-vertical
                      v-list
                        v-list-item(@click="fileCrud($event, {}, 'Download All')")
                          v-list-item-title Download all
                     
                v-divider

                template(v-for="(file, idx) in newLesson.files")
                  v-list-item.pl-2(@click="")
                    v-list-item-icon(v-if="file.type.includes('image')")
                      v-icon mdi-image
                    v-list-item-icon(v-else-if="file.type.includes('video')")
                      v-icon mdi-video
                    v-list-item-icon(v-else-if="file.type.includes('pdf')")
                      v-icon mdi-file-pdf
                    v-list-item-icon(v-else)
                      v-icon mdi-file
                    v-list-item-content.file-name
                      v-list-item-title(v-text='file.name')
                    v-spacer
                    v-spacer
                    v-list-item-content
                      v-list-item-title(v-text='file.type')
                    v-list-item-content
                      v-list-item-title {{ file.size > 1024 ? file.size > 1048576 ? `${(file.size / 1048576).toFixed(2)} GB` : `${(file.size / 1024).toFixed(2)} MB` : `${file.size.toFixed(2)} KB`}}
                    v-list-item-action.ml-0
                      v-menu(bottom left)
                        template(v-slot:activator='{ on, attrs }')
                          v-btn(icon v-bind='attrs' v-on='on')
                            v-icon mdi-dots-vertical
                        v-list
                          v-list-item(v-for='(item, i) in options' :key='i' @click="fileCrud($event, file, item)")
                            v-list-item-title {{ item }}
                  v-divider

            v-col.text-center(cols="12")
              v-btn.ma-2(color='indigo' @click="showFile" outlined)
                | Upload
                v-icon(right color="indigo") mdi-upload-outline

  v-row.justify-center
    v-col.text-center
      v-btn(color="indigo" @click='update' :loading="loading" dark)
        | Save
      v-btn(@click="cancel" :disabled="loading") Cancel

  //- modal
  v-row(justify='center')
    v-dialog(v-model='fileDialog' persistent='' max-width='500px')
      v-card
        v-card-title
          span.headline Files
        v-card-text.py-0
          v-container.py-0
            v-form(ref="fileForm" @submit.prevent="newFile")
              v-row
                v-col.px-0.pt-0.pb-2(cols='12')
                  v-list
                    v-list-item(v-for="file in newFiles")
                      v-list-item-icon(v-if="file.type.includes('image')")
                        v-icon mdi-image
                      v-list-item-icon(v-else-if="file.type.includes('video')")
                        v-icon mdi-video
                      v-list-item-icon(v-else-if="file.type.includes('pdf')")
                        v-icon mdi-file-pdf
                      v-list-item-icon(v-else)
                        v-icon mdi-file
                      v-list-item-content(style="flex-grow: 2;")
                        v-list-item-title {{ file.name }}
                      v-spacer
                      v-list-item-content
                        v-list-item-title {{ file.size > 1024 ? (file.size > 1048576 ? file.size > 1073741824 ? `${(file.size / 1073741824).toFixed(2)} GB` : `${(file.size / 1048576).toFixed(2)} MB` : `${(file.size / 1024).toFixed(2)} KB`) : `${file.size} B` }}
              v-row
                v-col.pa-0(cols='12')
                  v-file-input(v-model="newFiles" label="Upload files..." multiple outlined color="indigo" dense :rules="fileRules")
              v-row
                v-col.pt-0.pr-0.text-right
                  v-btn(color='indigo' text @click='fileDialog = false; newFiles = [];' :disabled="loading") Close
                  v-btn(color='indigo' text type="submit" :loading="loading") Save
</template>

<script>
/* eslint-disable */
import LessonService from '@/services/LessonService'
import ExerciseService from '@/services/ExerciseService'
import FileService from '@/services/FileService'
import vexUI from "@/plugins/vex"
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export default {
  name: 'LessonForm',
  data () {
    return {
      newLesson: {
        name: '',
        duration: '',
        description: '',
        files: [],
        exercises: [{
          name: '',
          video: null,
          videoPoster: null,
          useScore: true,
          timeSignature: '4/4',
          bpm: 60,
          numberOfBars: 4,
          melody: [],
          demoStartTime: "0",
          useXml: false,
          musicXml: null,
          handler: null,
        }]
      },
      lesson: null,
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
      nameRules: [
        v => !!v || "Name is required",
        v => new RegExp(/^[a-zA-Z0-9 ]{2,30}$/).test(v) || "Name must be alphanumeric characters and of length 2 - 30"
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
      time_signatures: ["4/4", "3/4", "2/4", "3/8", "6/8"],
      loading: false,
      error: null,

      // dialog
      fileDialog: false,
      newFiles: [],

      // options for file CRUD
      options: ['Download', 'Delete'],
      uuid: 0,

      // expansion panel
      openedExercise: [0]
    }
  },
  
  // watch: {
  //   newFiles (val) {
  //     console.log(val)
  //   }
  // },

  methods: {
    showFile () {
      this.fileDialog = true
    },

    showVex (event, exerciseIdx) {
      if (this.handler == null) {
        var div = document.createElement("div")
        div.id = `vexflow-wrapper-${exerciseIdx}`
        var pannel = document.getElementById(`pannel-content-${exerciseIdx}`)
        pannel.appendChild(div)
        this.handler = new vexUI.Handler(div.id, {
          canvasProperties: {
            id: div.id + '-canvas',
            width: pannel.offsetWidth - 32,
            tabindex: 1
          }
        }).init()
      }
    },
    
    changeTimeSignature (event, exerciseIdx) {
      this.newLesson.exercises[exerciseIdx].handler.setTimeSignature(this.newLesson.timeSignature)
    },

    changeBars (event, exerciseIdx) {
      this.newLesson.exercises[exerciseIdx].handler.changeNumberOfBars(this.newLesson.numberOfBars, this.handler.exportNotes())
    },

    changeMelody (event, exerciseIdx) {
      this.newLesson.exercises[exerciseIdx].melody = this.handler.exportNotes()
    },

    async update () {
      var tempLesson = this.newLesson

      if (!this.$refs.lessonForm.validate())
        return

      for (let i = 0; i < tempLesson.exercises.length; i++) {
        if (tempLesson.exercises[i].useScore && (!tempLesson.exercises[i].musicXml || tempLesson.exercises[i].melody.length == 0)) {
          alert('Please ensure that you have input corresponding data if you choose to use score')
          return
        }
      }

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
        console.log(lessonResponse)

        await Promise.all(this.newLesson.files.map(async fileObj => {
          let formData = new FormData()
          formData.set('lessonId', lessonResponse.data.lesson.id)
          formData.set('name', fileObj.name)
          formData.set('size', parseInt(fileObj.size))
          formData.set('type', fileObj.type)
          formData.append('file', fileObj.file)
          return FileService.create(formData)
        }))
      }

      // create exercise that belongs to lessons
      for (let i = 0; i < tempLesson.exercises.length; i++) {
        var formData = new FormData()
        formData.set('name', '')
        formData.set('melody', tempLesson.exercises[i].melody.join('-'))
        formData.set('timeSignature', tempLesson.exercises[i].timeSignature)
        formData.set('bpm', tempLesson.exercises[i].bpm)
        formData.set('numberOfBars', tempLesson.exercises[i].numberOfBars)
        formData.set('demoStartTime', parseInt(tempLesson.exercises[i].demoStartTime))
        formData.set('useScore', tempLesson.exercises[i].useScore)
        if (tempLesson.exercises[i].useScore) {
          if (!tempLesson.exercises[i].useXml) {
            formData.set('useXml', false)
            formData.set('melody', tempLesson.exercises[i].melody.join('-'))
            formData.set('timeSignature', tempLesson.exercises[i].timeSignature)
          } else {
            formData.set('useXml', true)
          }
        }
        if (tempLesson.exercises[i].video) {
          formData.append('video', tempLesson.exercises[i].video)
        }
        if (tempLesson.exercises[i].videoPoster) {
          formData.append('videoPoster', tempLesson.exercises[i].videoPoster)
        }
        if (tempLesson.exercises[i].musicXml) {
          formData.append('musicXml', tempLesson.exercises[i].musicXml)
        }

        console.log(formData)
        if (this.$route.params.lesson_id) {
          formData.set('id', this.lesson.Exercises[i].id)
          await ExerciseService.edit(formData)
        } else {
          formData.set('lid', lessonResponse.data.lesson.id)
          await ExerciseService.create(formData)
        }
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
    },

    async newFile () {
      if (this.$refs.fileForm.validate()) {
        this.loading = true
        if (this.lesson) {
          this.newFiles.forEach(async f => {
            let formData = new FormData()
            formData.set('lessonId', this.lesson.id)
            formData.set('name', f.name)
            formData.set('size', parseInt(f.size / 1024))
            formData.set('type', f.type)
            formData.append('file', f)
            this.newLesson.files.push((await FileService.create(formData)).data.file)
          })
        } else {
          this.newLesson.files = this.newLesson.files.concat(this.newFiles.map(f => {
            return {
              file: f,
              size: f.size / 1024,
              type: f.type,
              name: f.name
            }
          }))
        }
        this.newFiles = []
        this.fileDialog = false
        this.loading = false
      }
    },

    async fileCrud (event, file, action) {
      if (action == 'Download') {
        var zip = new JSZip();
        fetch(file.url)
          .then(resp => resp.blob())
          .then(content => saveAs(content, file.name));
      } else if (action == 'Delete') {
        let idx = this.newLesson.files.indexOf(file)
        this.newLesson.files.splice(idx, 1)
        await FileService.delete(file.id)
      } else if (action == 'Download All') {
        if (this.newLesson.files.length > 0) {
          const zip = new JSZip()
          let files = this.newLesson.files
          Promise.all(files.map(file => fetch(file.url))).then(function (responses) {
            // Get a JSON object from each of the responses
            return Promise.all(responses.map(function (response) {
              return response.blob();
            }));
          }).then(function (data) {
            for (var i = 0; i < data.length; i++) {
              zip.file(files[i].name, data[i])
            }
            zip.generateAsync({type:"blob"})
              .then(function (blob) {
                saveAs(blob, "download.zip")
              })
          }).catch(function (error) {
            // if there's an error, log it
            console.log(error);
          });
        }
      }
    },

    newExercise () {
      this.newLesson.exercises.push({
        name: '',
        video: null,
        videoPoster: null,
        useScore: true,
        timeSignature: '4/4',
        bpm: 60,
        numberOfBars: 4,
        melody: [],
        demoStartTime: "0",
        useXml: false,
        musicXml: null,
        handler: null,
      })
    }
  },

  mounted: async function () {
    if (this.$route.params.lesson_id) {
      this.lesson = (await LessonService.show(this.$route.params.lesson_id)).data.lesson

      this.newLesson.files = (await FileService.list(this.lesson.id)).data.files

      this.newLesson.name = this.lesson.name
      this.newLesson.duration = this.lesson.duration
      this.newLesson.description = this.lesson.description
      if (this.lesson.Exercises) {
        for (var i = 0; i < this.lesson.Exercises[i]; i++) {
          if (!this.newLesson.exercises[i]) {
            this.newExercise()
          }
          this.newLesson.exercises[i].name = this.lesson.Exercises[i].name
          this.newLesson.exercises[i].useScore = this.lesson.Exercises[i].useScore
          this.newLesson.exercises[i].useXml = this.lesson.Exercises[i].useXml
          this.newLesson.exercises[i].demoStartTime = this.lesson.Exercises[i].demoStartTime
          if (this.newLesson.exercises[i].useScore) {
            if (!this.newLesson.exercises[i].useXml && i == 0) {
              this.newLesson.exercises[i].timeSignature = this.lesson.Exercises[i].timeSignature
              this.newLesson.exercises[i].bpm = this.lesson.Exercises[i].bpm
              this.newLesson.exercises[i].numberOfBars = this.lesson.Exercises[i].numberOfBars
              this.newLesson.exercises[i].melody = this.lesson.Exercises[i].melody.split('-')
              await this.$nextTick()
              var div = document.createElement("div")
              div.id = `vexflow-wrapper-${i}`
              var pannel = document.getElementById(`pannel-content-${i}`)
              pannel.appendChild(div)
              this.handler = new vexUI.Handler(div.id, {
                numberOfStaves: this.newLesson.exercises[i].numberOfBars,
                canvasProperties: {
                  id: div.id + '-canvas',
                  width: pannel.offsetWidth - 32,
                  tabindex: 1
                }
              }).init()
              this.handler.importNotes(this.newLesson.exercises[i].melody, this.newLesson.exercises[i].timeSignature)
            }
          }
        }
      }
    } else {
      await this.$nextTick()
      var div = document.createElement("div")
      div.id = `vexflow-wrapper-0`
      var pannel = document.getElementById(`pannel-content-0`)
      pannel.appendChild(div)
      this.handler = new vexUI.Handler(div.id, {
        numberOfStaves: 4,
        canvasProperties: {
          id: div.id + '-canvas',
          width: pannel.offsetWidth,
          tabindex: 1
        }
      }).init()
    }
  }
}
</script>

<style scoped>
.file-name {
  flex-grow: 3;
}
</style>