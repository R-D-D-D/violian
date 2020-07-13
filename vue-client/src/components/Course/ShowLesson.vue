<template lang="pug">
  div
    v-card
      v-row.justify-center
        v-col(cols="11")
          h1.display-1.text-left Description
        v-col(cols="11")
          p {{ description }}

      v-row.justify-center
        v-col(cols="11").text-center.pa-0
          video.vjs-big-play-centered(ref="videoPlayer" class="video-js" @timeupdate="timeUpdated" :id="`vexflow-video-${lesson.id}`")
      
      v-row(v-if="melody[0] != ''")
        v-col(cols="12")
          .display-1 The score
        v-col(cols="12")
          div(:id="'vexflow-wrapper-' + lesson.id"  @click="enable_save_btn")

      v-row(v-if="!is_student")
        v-col
          v-btn.mt-5(x-large light :disabled="disable" @click="update_rhythms" :loading="save_btn_loading")
            v-icon(left dark) mdi-content-save-all-outline
            | Save Lesson
        v-col
          v-btn.mt-5(x-large light :disabled="disable" @click="update_rhythms" :loading="save_btn_loading")
            v-icon(left dark) mdi-content-save-all-outline
            | Edit Lesson

    v-row.justify-center
      v-col.text-left(cols="11")
        h1.pl-4 Discussion
      //- v-col.text-left(cols="11")
      //-   v-btn(large color="red darken-3" dark @click="dialog = true" v-if="!is_student") Reply to your student
      //-   v-btn(large color="red darken-3" dark @click="dialog = true" v-else) Submit your playing!
      //- v-col(cols="11" v-if="is_student")
      //-   v-expansion-panels(v-if="lesson.thread")
      //-     v-expansion-panel(v-for='(post, i) in lesson.thread.posts' :key='post.id')
      //-       v-expansion-panel-header {{ new Date(post.createdAt).toLocaleString() }}
      //-       v-expansion-panel-content
      //-         | {{ post.message }}
      v-col(cols="11" v-if="lesson.thread")
        v-list(v-if="lesson.thread.posts")
          v-list-item(v-for='(post, idx) in lesson.thread.posts' :key='post.id')
            v-list-item-content.pb-0
              v-container.pt-0.pb-4.px-0(fluid)
                v-row.py-0(v-if="idx == 0 || post.updatedAt.substring(0, 10) != lesson.thread.posts[idx - 1].updatedAt.substring(0, 10)")
                  v-col.py-0
                    v-chip(label color="indigo darken-3" dark style="font-size: 12px;") {{ new Date(post.updatedAt).toLocaleString([], { year: 'numeric', month: 'numeric', day:'numeric'}) }}
                v-row.mt-5
                  v-col.pb-0(style="margin-bottom: -3px;")
                    video(width="100%" height="audo" controls)
                      source(:src="post.videoUrl" type="video/mp4")
                      | Your browser does not support HTML video.

                v-row.justify-end.bottom-border.mx-0.py-3(v-if="post.UserId != user.id")
                  v-col.pr-8.py-0(cols="6") 
                    .speech-bubble-other
                      v-row.ma-0(style="width: 100%;")
                        v-col.text-left
                          div {{ post.message }}
                      .timestamp {{ new Date(post.updatedAt).toLocaleString([], { hour: '2-digit', minute:'2-digit'}) }}
                  v-col.pa-0(cols="1")
                    v-avatar(color='indigo' size="40")
                      v-img(:src="avatar")
                v-row.justify-start.bottom-border.mx-0.py-3(v-else)
                  v-col.pa-0(cols="1")
                    v-avatar(color='indigo' size="40")
                      v-img(:src="avatar")
                  v-col.pl-8.py-0(cols="6") 
                    .speech-bubble-self
                      v-row.ma-0(style="width: 100%;")
                        v-col.text-left
                          div {{ post.message }}
                      .timestamp {{ new Date(post.updatedAt).toLocaleString([], { hour: '2-digit', minute:'2-digit'}) }}
        v-row.justify-center
          v-col(cols="10")
            v-form(:ref="`form`")
              v-row
                v-col(cols="12")
                  v-textarea(outlined name='input-7-4' label='Any question for your tutor?' v-model="message")
                v-col(cols="6")
                  v-file-input(
                    accept="video/mp4, video/ogg" 
                    placeholder="Upload" 
                    prepend-icon="mdi-video"
                    label="Upload Video"
                    v-model="file")

              v-row
                v-col
                  v-btn(large color="red darken-3" dark @click="create_post") Submit practice video
    
    v-row.bpm-control(:id="`slider-${lesson.id}`" :class="{ hide: userinactive }")
      v-slider.mb-2(min="60" max="120" vertical color="white" track-color="rgba(115, 133, 159, 0.5)" thumb-label="always" v-model="playbackSpeed")
      v-icon(color="white") $vuetify.icons.custom_bpm
    
    //- v-row(justify='center')
      v-dialog(v-model='dialog' persistent max-width='600px')
        template(v-slot:activator='{ on, attrs }')
        v-card
          v-card-title
            span.headline Message
          v-card-text.py-0
            v-form(ref="studentform" v-if="is_student")
              v-container
                v-row
                  v-col(cols='12')
                    v-text-field(v-model="message" type="text" label='Message*' required)
                  v-col(cols="12")                          
                    v-file-input(
                      accept="video/mp4, video/ogg" 
                      placeholder="Upload" 
                      prepend-icon="mdi-video"
                      label="Practice Video"
                      v-model="file")
            v-form(ref="tutorform" v-else)
              v-container
                v-row
                  v-col(cols='12')
                    v-text-field(v-model="message" type="text" label='Message*' required)
                  v-col(cols='12')
                    v-subheader.pl-0 Grade
                    v-slider(v-model="grade" min='0' max='100' thumb-label :thumb-size="24")
                  v-col(cols="12")                          
                    v-file-input(
                      accept="video/mp4, video/ogg" 
                      placeholder="Feedback" 
                      prepend-icon="mdi-video"
                      label="Feedback Video"
                      v-model="file")
          v-card-actions
            v-spacer
            v-btn(color='indigo' text @click='dialog = false') Close
            v-btn(color='indigo' text @click="student_create_post") Save
          v-card-text(v-if="error")
            p {{ error }}  
</template>

<script>
import tone from "@/plugins/tone";
import vexUI from "@/plugins/vex";
import { mapState } from "vuex";
import utils from "@/utils";
import videojs from "video.js";
import PostService from "@/services/PostService"
import "videojs-hotkeys"

export default {
  name: 'ShowLesson',
  props: ['lesson'],
  data () {
    return {
      numberOfBars: 4,
      bpm: 60,
      timeSignature: '',
      playbackSpeed: 1,
      handler: {},
      disable: true,
      save_btn_loading: false,
      add_btn_loading: false,
      description: '',
      melody: [],
      videoHandler: null,
      hide: true,
      notesInBars: null,
      timePerTwoBars: 0,
      demoStartTime: 0,
      currentDisplayedBar: null,
      thread: null,
      dialog: false,
      requiredRules: [
        v => !!v || "This field is required"
      ],
      message: '',
      file: null,
      grade: '',
      avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
      error: null,
      userinactive: true
    }
  },
  watch: {
    bpm: function (val) {
      this.bpm_label = "BPM: " + val;
    },
    no_bars: function (val) {
      this.bars_label = "No. Bars: " + val;
    }
  },
  computed: {
    tutor () {
      if (this.user.isStudent)
        return this.$store.getters.tutorFromSubscribedTutors;
      else 
        return null;
    },

    is_student () {
      return this.user.isStudent;
    },

    ...mapState(["user", "students", "subscribedTutors"])
  },
  methods: {
    timeUpdated (event) {
      if (this.notesInBars) {
        if (this.currentDisplayedBar == null) {
          if ((event.target.currentTime - this.demoStartTime) / this.timePerTwoBars >= 0) {
            this.currentDisplayedBar = 0
            this.videoHandler.importNotes(this.notesInBars[0].concat(this.notesInBars[1]), this.timeSignature)
          } else {
            return
          }
        }

        if ((event.target.currentTime - this.demoStartTime) / this.timePerTwoBars - this.currentDisplayedBar >= 1) {
          var currBar = Math.floor((event.target.currentTime - this.demoStartTime) / this.timePerTwoBars)
          if (currBar >= this.notesInBars.length / 2)
            return
          this.currentDisplayedBar = currBar
          this.videoHandler.importNotes(this.notesInBars[currBar * 2].concat(this.notesInBars[currBar * 2 + 1]), this.timeSignature)
          return
        }
        if ((event.target.currentTime - this.demoStartTime) / this.timePerTwoBars < this.currentDisplayedBar) {
          var currBar1 = Math.floor((event.target.currentTime - this.demoStartTime) / this.timePerTwoBars)
          if (currBar1 < 0)
            return
          this.currentDisplayedBar = currBar1
          this.videoHandler.importNotes(this.notesInBars[currBar1 * 2].concat(this.notesInBars[currBar1 * 2 + 1]), this.timeSignature)
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
        var formData = new FormData()
        formData.set('tid', this.lesson.thread.id)
        formData.set('message', this.message)
        formData.set('grade', this.grade)
        formData.append('video', this.file)
        const response = await PostService.create(formData)
        this.lesson.thread.posts.splice(this.lesson.thread.posts.length, 0, response.data.post)
        this.message = ''
        this.file = null
      } else {
        return
      }
    }
  },

  mounted: function () {
    this.$on("play_sequence", () => {
      tone.init();
      // TODO disable edit when playing
      // this.handler.disableEdit();
      tone.playSequence(this.time_signature, this.bpm, this.handler.exportNotes(), parseInt(this.numberOfBars) + 1, this.handler);
      // this.handler.enableEdit();
    });

    const player = videojs(this.$refs.videoPlayer, {
        controls: true,
        fluid: true,
        sources: [
          {
            src: this.lesson.exercises[0].demoUrl,
            type: "video/mp4"
          }
        ],
        playbackRates: [0.8, 0.9, 1, 1.1, 1.2]
      }, () => {
        console.log('onPlayerReady', this)
        player.hotkeys({
          volumeStep: 0.1,
          seekStep: 2,
          enableModifiersForNumbers: false
        })
        player.on('userinactive', () => {
          console.log('userinactive')
          this.userinactive = true
        })
        player.on('useractive', () => {
          console.log('userinactive')
          this.userinactive = false
        })
        player.on('play', () => {
          console.log('play')
          this.userinactive = false
        })
    });


    // var Button = videojs.getComponent('Button');
    // var button = new Button(player, {
    //   clickHandler: function(event) {
    //     console.log(event)
    //     videojs.log('Clicked');
    //   }
    // });
    // player.addChild('button')
    // player.controlBar.el().appendChild(button.el());

    this.player = player

    console.log(videojs(`vexflow-video-3`))

    // console.log(button.el());

    //window.addEventListener('resize', this.onResize);
    // this generates the score

    this.melody = this.lesson.exercises[0].melody.split('-')
    this.bpm = parseInt(this.lesson.exercises[0].bpm)
    this.timeSignature = this.lesson.exercises[0].timeSignature
    if (this.melody[0] != "") {
      if (this.user.isStudent) {
        this.handler = new vexUI.Handler(`vexflow-wrapper-${this.lesson.id}`, {
          numberOfStaves: parseInt(this.lesson.exercises[0].numberOfBars),
          canEdit: false
        }).init();
      } else {
        this.handler = new vexUI.Handler(`vexflow-wrapper-${this.lesson.id}`, {
          numberOfStaves: parseInt(this.lesson.exercises[0].numberOfBars)
        }).init();
      }
      this.handler.importNotes(this.melody, this.timeSignature)
      this.notesInBars = this.handler.notesToBars(this.melody, this.timeSignature)

      var wrapper = document.createElement("div")
      wrapper.setAttribute('id', `video-vexflow-wrapper${this.lesson.id}`)
      wrapper.style.position = "absolute";
      wrapper.style.background = "#FAFAFA";
      wrapper.style.top = "0";
      wrapper.style.left = "0";
      wrapper.style.right = "0";
      this.videoHandler = new vexUI.Handler("vexflow-wrapper", {
        canEdit: false,
        numberOfStaves: 2,
        lessStaveHeight: true,
        canvasProperties: {
          id: "vexflow-wrapper" + "-canvas",
          width: this.$refs.videoPlayer.offsetWidth,
          height: 80 * vexUI.scale,
          tabindex: 1
        }
      }, wrapper).init();

      document.getElementById(`vexflow-video-${this.lesson.id}`).appendChild(wrapper)
      document.getElementsByClassName("v-slider__track-container")[0].style.width = "5px"
      document.getElementsByClassName("v-slider__thumb-label")[0].style.color = "black"
      document.getElementsByClassName("v-slider__thumb-label")[0].style.boxShadow = "0px 0px 5px black"
      document.getElementById(`vexflow-video-${this.lesson.id}`).appendChild(document.getElementById('slider-3'))
    }
    this.description = this.lesson.description
    this.demoStartTime = this.lesson.exercises[0].demoStartTime
    this.numberOfBars = parseInt(this.lesson.exercises[0].numberOfBars)

    this.timePerTwoBars = ((parseInt(this.timeSignature.split('/')[0]) / this.bpm) * 60) * 2
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

</style>
