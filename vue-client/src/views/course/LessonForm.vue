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
            v-col.py-0(cols="11")
              v-breadcrumbs.px-0.py-2(:items="currentFolder.path.split('/').filter(path => path != '')")
                template(v-slot:divider)
                  v-icon mdi-chevron-right
                template(v-slot:item="{ item }")
                  v-breadcrumbs-item
                    v-btn.px-2(@click="navigateTo($event, item)" text color="indigo" style="font-size:1rem !important;") {{ item }}

            v-col.py-0.text-right.pr-6(cols="1" align-self="center")
              v-btn(color='indigo' icon @click="showFolder")
                v-icon(large) mdi-plus
            
          v-divider

          v-row(v-if="currentFolder")
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
                        v-list-item(@click="folderCrud($event, currentFolder, 'Download')")
                          v-list-item-title Download all files
                     
                v-divider
                template(v-for="(folder, idx) in children")
                  v-list-item.pl-2(@click="" @dblclick="navigateTo($event, folder)")
                    v-list-item-icon
                      v-icon mdi-folder
                    v-list-item-content.file-name
                      v-list-item-title(v-text="folder.path.split('/').slice(-2)[0]")
                    v-spacer
                    v-spacer
                    v-list-item-content
                      v-list-item-title folder
                    v-list-item-content
                      v-list-item-title {{ folder.size > 1024 ? folder.size > 1048576 ? `${(folder.size / 1048576).toFixed(2)} GB` : `${(folder.size / 1024).toFixed(2)} MB` : `${folder.size} KB`}}
                    v-list-item-action.ml-0
                      v-menu(bottom left)
                        template(v-slot:activator='{ on, attrs }')
                          v-btn(icon v-bind='attrs' v-on='on')
                            v-icon mdi-dots-vertical
                        v-list
                          v-list-item(v-for='(item, i) in options' :key='i' @click="folderCrud($event, folder, item)")
                            v-list-item-title {{ item }}
                  v-divider
                template(v-for="(file, idx) in currentFolder.Files")
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
    v-dialog(v-model='folderDialog' persistent='' max-width='500px')
      v-card
        v-card-title
          span.headline Folder name
        v-card-text.py-0
          v-container.py-0
            v-form(ref="folderForm" @submit.prevent="newFolder")
              v-row
                v-col.pa-0(cols='12')
                  v-text-field(v-model="newFolderName" required @focus="$event.target.select()" outlined clearable color="indigo" dense :rules="nameRules")
              v-row
                v-col.pt-0.pr-0.text-right
                  v-btn(color='indigo' text @click="folderDialog = false; newFolderName = 'Untitled';" :disabled="loading") Close
                  v-btn(color='indigo' text type="submit" :loading="loading") Save
  
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
                  v-file-input(v-model="newFiles" label="Upload files..." multiple outlined clearable color="indigo" dense :rules="fileRules")
              v-row
                v-col.pt-0.pr-0.text-right
                  v-btn(color='indigo' text @click='fileDialog = false; newFiles = [];' :disabled="loading") Close
                  v-btn(color='indigo' text type="submit" :loading="loading") Save
</template>

<script>
/* eslint-disable */
import LessonService from '@/services/LessonService'
import ExerciseService from '@/services/ExerciseService'
import FolderService from '@/services/FolderService'
import FileService from '@/services/FileService'
import vexUI from "@/plugins/vex"
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import JSZipUtils from 'jszip-utils'

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
      currentFolder: null,
      loading: false,
      error: null,

      // dialog
      folderDialog: false,
      fileDialog: false,
      newFolderName: 'Untitled',
      newFiles: [],

      // options for file CRUD
      options: ['Download', 'Delete'],
      uuid: 0
    }
  },

  computed: {
    children () {
      let currPath = this.currentFolder.path
      return this.newLesson.folders.filter(folder => folder.path.includes(currPath) && folder.path.split(currPath).length == 2 && folder.path.split(currPath)[1] != '')
    }
  },
  
  watch: {
    newFiles (val) {
      console.log(val)
    }
  },

  methods: {
    showFolder () {
      this.folderDialog = true
    },

    showFile () {
      this.fileDialog = true
    },

    showVex () {
      if (this.handler == null) {
        var div = document.createElement("div")
        div.id = `vexflow-wrapper`
        var pannel = document.getElementById(`pannel-content`)
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
      if (typeof folder == 'string') {
        // it from clicking breadcrumb
        this.currentFolder = this.newLesson.folders.find(f => f.path.split('/').slice(-2)[0] == folder)
      } else {
        this.currentFolder = folder
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
        console.log(lessonResponse)

        await Promise.all(this.newLesson.folders.map(async folder => {
          let folderResponse = await FolderService.create({
            path: folder.path,
            lessonId: lessonResponse.data.lesson.id
          })
          
          return Promise.all(folder.Files.map(fileObj => {
            let formData = new FormData()
            formData.set('folderId', folderResponse.data.folder.id)
            formData.set('name', fileObj.name)
            formData.set('size', parseInt(fileObj.size))
            formData.set('type', fileObj.type)
            formData.append('file', fileObj.file)
            return FileService.create(formData)
          }))
        }))
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
    },

    async newFile () {
      if (this.$refs.fileForm.validate()) {
        this.loading = true
        if (this.lesson) {
          this.newFiles.forEach(async f => {
            let formData = new FormData()
            formData.set('folderId', this.currentFolder.id)
            formData.set('name', f.name)
            formData.set('size', parseInt(f.size / 1024))
            formData.set('type', f.type)
            formData.append('file', f)
            this.currentFolder.Files.push((await FileService.create(formData)).data.file)
          })
        } else {
          this.currentFolder.Files = this.currentFolder.Files.concat(this.newFiles.map(f => {
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

    async newFolder () {
      if (this.$refs.folderForm.validate()) {
        if (this.lesson) {
          let newFolder = (await FolderService.create({
            path: this.currentFolder.path + `${this.newFolderName}/`,
            lessonId: this.lesson.id
          })).data.folder
          newFolder.Files = []
          this.newLesson.folders.push(newFolder)
        } else {
          this.newLesson.folders.push({
            path: this.currentFolder.path + `${this.newFolderName}/`,
            Files: [],
            size: 0,
            uuid: this.uuid
          })
          this.uuid++
        }
        this.newFolderName = 'Untitled'
        this.folderDialog = false
      }
    },

    async folderCrud (event, folder, action) {
      if (action == 'Download') {
        if (this.currentFolder.Files.length > 0) {
          const zip = new JSZip()
          let files = this.currentFolder.Files
          Promise.all(files.map(file => fetch(file.url))).then(function (responses) {
            // Get a JSON object from each of the responses
            return Promise.all(responses.map(function (response) {
              return response.blob();
            }));
          }).then(function (data) {
            // Log the data to the console
            // You would do something with both sets of data here
            for (var i = 0; i < data.length; i++) {
              zip.file(files[i].name, data[i])
            }

            zip.generateAsync({type:"blob"})
              .then(function (blob) {
                saveAs(blob, "download.zip")
              })
            console.log(data);
          }).catch(function (error) {
            // if there's an error, log it
            console.log(error);
          });
        }
      } else if (action == 'Delete') {
        if (this.lesson) {
          if (folder.Files.length > 0) {
            let files = folder.Files
            await Promise.all(files.map(file => FileService.delete(file.id)))
          }
          let idx = this.newLesson.folders.indexOf(folder)
          this.newLesson.folders.splice(idx, 1)
          await FolderService.delete(folder.id)
        } else {
          let idx = this.folders.indexOf(folder)
          this.folders.splice(idx, 1)
        }
      }
    },

    async fileCrud (event, file, action) {
      if (action == 'Download') {
        var zip = new JSZip();
        fetch(file.url)
          .then(resp => resp.blob())
          .then(content => saveAs(content, file.name));
      } else if (action == 'Delete') {
        let idx = this.currentFolder.Files.indexOf(file)
        this.currentFolder.Files.splice(idx, 1)
        await FileService.delete(file.id)
      }
    },
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
              width: pannel.offsetWidth - 32,
              tabindex: 1
            }
          }).init()
          this.handler.importNotes(this.newLesson.melody, this.newLesson.timeSignature)
        }
      }
    } else {
      const folder = {
        path: 'Resources/',
        size: 0,
        Files: [],
        uuid: this.uuid
      }
      this.uuid++
      this.newLesson.folders.push(folder),
      this.currentFolder = folder
      await this.$nextTick()
      var div = document.createElement("div")
      div.id = `vexflow-wrapper`
      var pannel = document.getElementById(`pannel-content`)
      pannel.appendChild(div)
      this.handler = new vexUI.Handler(div.id, {
        numberOfStaves: this.newLesson.numberOfBars,
        canvasProperties: {
          id: div.id + '-canvas',
          width: pannel.offsetWidth - 32,
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