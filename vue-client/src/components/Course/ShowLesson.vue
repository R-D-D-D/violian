<template lang="pug">
  div(v-if="course && lesson")
    v-container.pa-0(fluid)
      v-row(no-gutters)
        v-col(cols="9").text-left.pa-0
          v-row.ma-0(style="width: 100%;")
            v-col.pa-0#title
              h1.font-weight-bold.pl-8.py-2 {{ course.name }}
          v-row.ma-0(style="width: 100%;")
            v-col.pa-0
              video-player(:exercise="this.lesson.exercises[0]" :videoSrc="src" v-if="isVideoContent")
          
          v-container 
            v-tabs(v-model='tab' color="indigo")
              v-tabs-slider
              v-tab(href=`#overview`) Overview
              v-tab-item(value="overview")
                v-card(flat tile)
                  v-container
                    v-row
                      v-col
                        h1 About this lesson
                    v-row
                      v-col
                        div {{ lesson.description }}

              v-tab(href=`#resources`) Resources
              v-tab-item(value="resources")
                v-card(flat tile)
                  v-container
                    v-row
                      v-col
                        h1 Resources
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

                          template(v-for="(file, idx) in lesson.files")
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
                                    v-list-item(@click="fileCrud($event, file, 'Download')")
                                      v-list-item-title Download
                            v-divider
              v-tab(href=`#discussion` v-if="user.isStudent") Ask your tutor
              v-tab-item(value="discussion" v-if="user.isStudent")
                v-card(flat tile)
                  v-container#dicussion
                    v-row.justify-center
                      v-col.text-left.pb-0(cols="12")
                        h1.font-weight-bold.pt-2.pl-4 Ask your tutor about "{{ lesson.name }}"
                      v-col.pb-0(cols="12" v-if="lesson.thread")
                        v-list(v-if="lesson.thread.posts")
                          v-list-item(v-for='(post, idx) in lesson.thread.posts' :key='post.id')
                            v-list-item-content.pb-0
                              v-container.pt-0.pb-4.px-0(fluid)
                                v-row.py-0(v-if="idx == 0 || post.updatedAt.substring(0, 10) != lesson.thread.posts[idx - 1].updatedAt.substring(0, 10)")
                                  v-col.py-0
                                    v-chip(label color="indigo" dark style="font-size: 12px;") {{ new Date(post.updatedAt).toLocaleString([], { year: 'numeric', month: 'numeric', day:'numeric'}) }}
                                v-row.mt-5(v-if="post.videoUrl")
                                  v-col.pb-0.text-center(style="margin-bottom: -3px; background-color:black;")
                                    video(style="max-width:100%; max-height:400px;" controls)
                                      source(:src="post.videoUrl" type="video/mp4")
                                      | Your browser does not support HTML video.
                                v-row(v-else)
                                  v-col.pb-0(style="border-bottom: 1px solid #BDBDBD;")


                                v-row.justify-end.bottom-border.mx-0.py-3(v-if="post.UserId != user.id")
                                  v-col.py-0.text-left(cols="5" v-if="post.UserId == user.id")
                                    v-btn(icon @click="deletePost($event, post)" color="indigo")
                                      v-icon mdi-trash-can-outline
                                  v-col.pr-8.py-0(cols="6") 
                                    .speech-bubble-other
                                      v-row.ma-0(style="width: 100%;")
                                        v-col.text-left
                                          div {{ post.message }}
                                      .timestamp {{ new Date(post.updatedAt).toLocaleString([], { hour: '2-digit', minute:'2-digit'}) }}
                                  v-col.text-center.pa-0(cols="1")
                                    v-avatar(color='grey' size="40")
                                      v-icon mdi-account
                                v-row.justify-start.bottom-border.mx-0.py-3(v-else)
                                  v-col.text-center.pa-0(cols="1")
                                    v-avatar(color='grey' size="40")
                                      v-icon mdi-account
                                  v-col.pl-8.py-0(cols="6") 
                                    .speech-bubble-self
                                      v-row.ma-0(style="width: 100%;")
                                        v-col.text-left
                                          div {{ post.message }}
                                      .timestamp {{ new Date(post.updatedAt).toLocaleString([], { hour: '2-digit', minute:'2-digit'}) }}
                                  v-col.py-0.text-right(cols="5" v-if="post.UserId == user.id")
                                    v-btn(icon @click="deletePost($event, post)" color="indigo")
                                      v-icon mdi-trash-can-outline
                    
                    v-row.justify-center
                      v-col.pt-0(cols="12")
                        v-form.px-4(:ref="`form`")
                          v-row
                            v-col.pt-0(cols="12")
                              v-textarea(outlined name='input-7-4' label='Type your thoughts here...' v-model="message")
                            v-col(cols="6")
                              v-file-input(
                                accept="video/mp4, video/ogg" 
                                placeholder="Upload" 
                                prepend-icon="mdi-video"
                                label="Upload Video"
                                v-model="file")

                          v-row
                            v-col
                              v-btn(large color="#ec5252" dark @click="create_post") Submit practice video

        v-col.pa-0(cols="3" style="border-bottom: 1px solid #BDBDBD; border-left: 1px solid #BDBDBD; position: fixed; right:0;" :class="{ 'full-height': fullHeight, 'partial-height': !fullHeight }")
          h1.font-weight-bold.pl-4.py-2(style="background-color:#EEEEEE;") Lessons

          v-list.py-0
            v-list-item.px-0(v-for='(currLesson, lessonIdx) in course.lessons' :key='lessonIdx')
              v-expansion-panels.px-0(accordion flat hover tile dense v-if="currLesson == lesson && lesson.exercises.length > 1" v-model="opened" multiple)
                v-expansion-panel
                  v-expansion-panel-header.py-0.pl-4.pr-2(style="font-size: 16px; background-color:#C5CAE9;") {{ lessonIdx + 1 }}. {{currLesson.name}}
                  v-expansion-panel-content.pa-0
                    v-list.py-0
                      v-list-item-group.py-0
                        v-list-item.px-0(v-for="(exercise, exerciseIdx) in currLesson.exercises" @click="src = exercise.videoUrl" :key="exerciseIdx")
                          v-list-item-content
                            div.pl-4.text-decoration-underline(style="font-size: 14px; color:#291957;") {{ exercise.name }}
              v-list-item-content.py-0.link(v-else-if="currLesson == lesson && lesson.exercises.length == 1")
                a.link.pl-4.py-5(style="font-size: 16px; background-color:#C5CAE9;") {{ lessonIdx + 1 }}. {{ currLesson.name }}
              v-list-item-content.py-0.link(v-else-if="currLesson != lesson")
                a.link.pl-4.py-5(style="font-size: 16px;" @click="goToLesson($event, currLesson)") {{ lessonIdx + 1 }}. {{ currLesson.name }}

      
      v-row.justify-center(v-show="useScore")
        v-col(cols="12" v-if="!useXml")
          div(:id="'vexflow-wrapper-' + lesson.id")
        v-col(cols="12" v-else)
          div(:id="'osmd-wrapper-' + lesson.id")
</template>

<script>
/* eslint-disable */
import vexUI from "@/plugins/vex";
import { mapState } from "vuex";
import utils from "@/utils";
import videojs from "video.js";
import PostService from "@/services/PostService"
import "videojs-hotkeys"
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay"
import CourseService from "@/services/CourseService"
import FileService from "@/services/FileService"
import VideoPlayer from "@/components/Course/VideoPlayer"
import ThreadService from "@/services/ThreadService"
import _ from 'lodash'

export default {
  name: 'ShowLesson',
  components: {
    'video-player': VideoPlayer
  },
  data () {
    return {
      // exercise info
      numberOfBars: null,
      bpm: null,
      timeSignature: null,
      disable: true,
      save_btn_loading: false,
      add_btn_loading: false,
      description: '',
      melody: [],
      useScore: false,
      useXml: false,
      notesInBars: null,
      playbackBpm: 0,
      handler: {},
      videoHandler: null,

      // thread info
      thread: null,
      dialog: false,
      requiredRules: [
        v => !!v || "This field is required"
      ],
      message: null,
      file: null,
      grade: null,
      avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
      error: null,

      // video events
      isVideoContent: true,

      // osmd renderer
      osmd: null,
      videoOsmd: null,
      from: 1,
      to: 2,

      // page design
      selected: null,
      course: null,
      lesson: null,
      fullHeight: false,
      opened: [0],
      src: '',

      // tabs
      tab: null,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    }
  },
  watch: {
    bpm: function (val) {
      this.bpm_label = "BPM: " + val;
    },
    no_bars: function (val) {
      this.bars_label = "No. Bars: " + val;
    },
    // playbackBpm: function (val) {
    //   this.player.playbackRate(val / this.bpm)
    // }
    '$route.params.lesson_id': function (val) {
      this.$router.go()
    }
  },
  computed: {
    ...mapState(["user", "students", "subscribedTutors"])
  },
  methods: {
    timeUpdated (event) {
      let currTime = this.player.currentTime()
      let offset = currTime - this.demoStartTime
      let currBar = Math.floor(offset / this.timePerTwoBars)
      if (currBar != this.currentDisplayedBar) {
        if (currBar >= 0 && currBar < Math.floor(this.numberOfBars / 2)) {
          this.currentDisplayedBar = currBar
          this.videoHandler.importNotes(this.notesInBars[currBar * 2].concat(this.notesInBars[currBar * 2 + 1]), this.timeSignature)
        } else if (currBar < 0 && this.currentDisplayedBar != 0) {
          this.currentDisplayedBar = 0
          this.videoHandler.importNotes(this.notesInBars[0].concat(this.notesInBars[1]), this.timeSignature)
        } else if (currBar > Math.floor(this.numberOfBars / 2)) {
          if (this.numberOfBars < 2) {
            this.currentDisplayedBar = 0
            this.videoHandler.importNotes(this.notesInBars[0].concat(this.notesInBars[1]), this.timeSignature)
          } else {
            this.currentDisplayedBar = Math.floor(this.numberOfBars / 2)
            this.videoHandler.importNotes(this.notesInBars[this.numberOfBars - 1].concat(this.notesInBars[this.numberOfBars - 1]), this.timeSignature)
          }
        }
      }
    },

    async timeUpdatedOsmd (event) {
      let currTime = this.player.currentTime()
      let offset = currTime - this.demoStartTime
      let currBar = Math.floor(offset / this.timePerTwoBars)
      if (currBar != this.currentDisplayedBar) {
        if (currBar >= 0 && currBar < Math.floor(this.numberOfBars / 2)) {
          console.log(currBar)
          this.videoOsmd.setOptions({
            drawFromMeasureNumber: (currBar * 2) + 1,
            drawUpToMeasureNumber: (currBar * 2) + 2
          })
          this.currentDisplayedBar = currBar
          await this.videoOsmd.render()
        } else if (currBar < 0 && this.currentDisplayedBar != 0) {
          console.log(currBar)
          this.videoOsmd.setOptions({
            drawFromMeasureNumber: 1,
            drawUpToMeasureNumber: 2
          })
          this.currentDisplayedBar = 0
          await this.videoOsmd.render()
        } else if (currBar > Math.floor(this.numberOfBars / 2)) {
          console.log(currBar, 'from third clause')
          if (this.numberOfBars < 2) {
            this.videoOsmd.setOptions({
              drawFromMeasureNumber: 0,
              drawUpToMeasureNumber: 0
            })
            this.currentDisplayedBar = 0
          } else {
            this.videoOsmd.setOptions({
              drawFromMeasureNumber: this.numberOfBars - 1,
              drawUpToMeasureNumber: this.numberOfBars
            })
            this.currentDisplayedBar = Math.floor((currTime - this.demoStartTime) / this.timePerTwoBars)
          }
          await this.videoOsmd.render()
        }
      }
    },

    async update_rhythms () {
      this.save_btn_loading = true;
      var oldRhythmIdx = this.lesson.rhythms.indexOf(this.active_rhythm);
      // console.log("oldRhythmIdx", oldRhythmIdx)
      var newRhythm = {
        id: this.active_rhythm.id,
        title: this.active_rhythm_title,
        timeSignature: this.time_signature,
        noOfBars: this.no_bars,
        bpm: this.bpm,
        rhythm: this.handler.exportNotes()
      }

      var newLesson = utils.cloneLesson(this.lesson);
      newLesson.rhythms[oldRhythmIdx] = newRhythm;
      newLesson.rhythms = utils.generateRhythmsString(newLesson.rhythms);
      await this.$store.dispatch("editRhythm", {
        lesson: this.lesson,
        newLesson: newLesson
      });
      this.save_btn_loading = false;
      this.display_rhythm({}, this.lesson.rhythms[oldRhythmIdx]);
    },

    enable_save_btn () {
      this.disable = false;
    },

    async create_post () {
      if (this.$refs.form.validate()) {
        if (!this.message && !this.file) {
          alert('Please either input video or message or both')
          return
        }
        var formData = new FormData()
        formData.set('tid', this.lesson.thread.id)
        if (this.message) 
          formData.set('message', this.message)
        if (this.grade) 
          formData.set('grade', parseInt(this.grade))
        if (this.file)
          formData.append('video', this.file)
        const response = await PostService.create(formData)
        this.lesson.thread.posts.splice(this.lesson.thread.posts.length, 0, response.data.post)
        this.message = ''
        this.file = null
      } else {
        return
      }
    },

    async deletePost (event, post) {
      if (confirm('Are you sure you want to delete?')) {
        await PostService.delete(post.id)
        this.lesson.thread.posts.splice(this.lesson.thread.posts.indexOf(post), 1)
      }
    },

    async drawOsmdScores () {
      // video osmd
      var background = document.createElement("div")
      background.setAttribute('id', `video-overlay-background-${this.lesson.id}`)
      background.style.position = "absolute";
      background.style.background = "#FAFAFA";
      background.style.top = "0";
      background.style.left = "0";
      background.style.right = "0";
      background.style.height = "130px";
      background.style.overflow = "hidden"

      var scoreWrapper = document.createElement("div")
      scoreWrapper.setAttribute('id', `video-osmd-wrapper-${this.lesson.id}`)
      scoreWrapper.style.position = "absolute";
      scoreWrapper.style.background = "#FAFAFA";
      scoreWrapper.style.top = "0";
      scoreWrapper.style.left = "0";
      scoreWrapper.style.right = "0";

      var score = document.createElement('div')
      background.appendChild(scoreWrapper)
      scoreWrapper.appendChild(score)
      document.getElementById(`video-${this.lesson.id}`).appendChild(background)

      this.videoOsmd = new OpenSheetMusicDisplay(
        score, 
        {
          drawFromMeasureNumber: this.from,
          drawUpToMeasureNumber: this.to,
          drawComposer: false,
          drawTitle: false,
          renderSingleHorizontalStaffline: true,
          drawPartNames: false,
          autoResize: false,
          drawMetronomeMarks: false,
          backend: 'Canvas',
          drawingParameters: 'compacttight'
        }
      )
      await this.videoOsmd.load(this.lesson.exercises[0].musicXmlUrl);
      await this.$nextTick()
      this.videoOsmd.zoom = 1.2
      // this.videoOsmd.setCustomPageFormat(1, .3)
      // await this.videoOsmd.preCalculate() 
      // score.style.top = `${(this.videoOsmd.graphic.musicPages[0].boundingBox.borderMarginTop + this.videoOsmd.graphic.musicPages[0].boundingBox.absolutePosition.y) * 10 * -1}px`
      // console.log('top', score.style.top)
      await this.videoOsmd.render()
      console.log(this.videoOsmd.graphic)
      console.log(this.videoOsmd.graphic.music)
      // console.log(this.videoOsmd.graphic.musicPages[0].musicSystems)
      // console.log(this.videoOsmd)


      this.osmd = new OpenSheetMusicDisplay(
        `osmd-wrapper-${this.lesson.id}`, 
        {
          drawPartNames: false,
          drawComposer: false
        }
      )
      await this.osmd.load(scoreXml.data)
      await this.$nextTick()
      this.osmd.zoom = 1.2
      await this.osmd.render()

    },

    drawScores (isRedraw) {
      // TODO implement this
      // if (isRedraw) {
      //   const score = document.getElementById(`video-vexflow-wrapper${this.lesson.id}`)
      //   while (score.firstChild) {
      //     score.removeChild(score.lastChild);
      //   }
      //   const videoScore = document.getElementById(`vexflow-wrapper-${this.lesson.id}`)
      //   while (videoScore.firstChild) {
      //     videoScore.removeChild(videoScore.lastChild);
      //   }
      // }
      if (this.user.isStudent) {
        this.handler = new vexUI.Handler(`vexflow-wrapper-${this.lesson.id}`, {
          numberOfStaves: parseInt(this.lesson.exercises[0].numberOfBars),
          canEdit: false
        }).init();
      } else {
        console.log(`vexflow-wrapper-${this.lesson.id}`)
        console.log(document.getElementById(`vexflow-wrapper-${this.lesson.id}`))
        this.handler = new vexUI.Handler(`vexflow-wrapper-${this.lesson.id}`, {
          numberOfStaves: parseInt(this.lesson.exercises[0].numberOfBars)
        }).init();
      }
      this.handler.importNotes(this.melody, this.timeSignature)
      this.notesInBars = this.handler.notesToBars(this.melody, this.timeSignature)

      var wrapper = document.createElement("div")
      wrapper.setAttribute('id', `video-vexflow-wrapper-${this.lesson.id}`)
      wrapper.style.position = "absolute";
      wrapper.style.background = "#FAFAFA";
      wrapper.style.top = "0";
      wrapper.style.left = "0";
      wrapper.style.right = "0";
      this.videoHandler = new vexUI.Handler(`video-vexflow-wrapper-${this.lesson.id}`, {
        canEdit: false,
        numberOfStaves: 2,
        lessStaveHeight: true,
        canvasProperties: {
          id: `video-vexflow-wrapper-${this.lesson.id}` + "-canvas",
          width: this.$refs.videoPlayer.offsetWidth,
          height: 80 * vexUI.scale,
          tabindex: 1
        }
      }, wrapper).init();

      this.videoHandler.importNotes(this.notesInBars[0].concat(this.notesInBars[1])  , this.timeSignature)

      document.getElementById(`video-${this.lesson.id}`).appendChild(wrapper)
    },

    goToLesson (event, lesson) {
      this.$router.push({
        name: `showlesson`,
        params: {
          course_id: this.course.id,
          lesson_id: lesson.id,
          course: this.course,
          lesson: lesson
        }
      })
    },

    async fileCrud (event, file, action) {
      if (action == 'Download') {
        var zip = new JSZip();
        fetch(file.url)
          .then(resp => resp.blob())
          .then(content => saveAs(content, file.name));
      } else if (action == 'Download All') {
        if (this.lesson.files.length > 0) {
          const zip = new JSZip()
          let files = this.lesson.files
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
  },

  created: async function () {
    if (!this.course || !this.lesson) {
      let response = await CourseService.show(this.$route.params.course_id)
      try {
        response.data.course.lessons = await Promise.all(response.data.course.lessons.map(async (lesson) => {
          var threadResponse = null
          this.$store.dispatch('setNotifications', this.$store.state.notifications - response.data.course.unreadTutorPost)
          threadResponse = await ThreadService.show(lesson.id, this.user.id)
          lesson.thread = threadResponse.data.thread
          return lesson
        }))
        this.course = response.data.course
      } catch (err) {
        console.log(err)
      }
      this.lesson = this.course.lessons.find(lesson => lesson.id == this.$route.params.lesson_id)
      this.lesson.files = (await FileService.list(this.lesson.id)).data.files
    }

    this.selected = this.course.lessons.indexOf(this.lesson)
    this.src = this.lesson.exercises[0].videoUrl

    window.addEventListener('scroll', () => {
      if (window.pageYOffset == 0) {
        this.fullHeight = false
      } else if (window.pageYOffset > 64) {
        this.fullHeight = true
      }
    })
  },

  beforeDestroy() {
    if (this.player) {
        this.player.dispose()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 
/* 
bg: #5d646e
slider-bg: #72839d
 */
.hide {
  opacity: 0 !important;
  visibility: hidden !important;
}

.bpm-control {
  background-color: rgba(43, 51, 63, 0.7); 
  position: absolute; 
  bottom: 30px; 
  left: 12px; 
  width: 30px;
  visibility: visible;
  opacity: 1;
  transition: visibility 1000ms, opacity 1000ms;
}

#title {
  background-color: #1e1e1c;
  color: white;
}

.selected-border {
  background-color: #E8EAF6;
}

.full-height {
  height: 100vh;
  top: 0;
}

.partial-height {
  height: calc(100vh - 64px);
}

.link:hover {
  background-color: #FAFAFA;
}

.link, .link:link, .link:visited, .link:active, .link:hover {
  text-decoration: none;
  color: #1e1e1c;
}

div >>> .v-slide-group__content {
  border-bottom: 1px solid #BDBDBD;
}
</style>
