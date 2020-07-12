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
          #vexflow-wrapper
          
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

    v-row
      v-col.text-left(cols="11")
        h1 Discussion
      v-col.text-left(cols="11")
        v-btn(large color="red darken-3" dark @click="dialog = true" v-if="!is_student") Reply to your student
        v-btn(large color="red darken-3" dark @click="dialog = true" v-else) Submit your playing!
      v-col(cols="11" v-if="is_student")
        v-expansion-panels(v-if="lesson.thread")
          v-expansion-panel(v-for='(post, i) in lesson.thread.posts' :key='post.id')
            v-expansion-panel-header {{ new Date(post.createdAt).toLocaleString() }}
            v-expansion-panel-content
              | {{ post.message }}
    
    v-row(justify='center')
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
                    v-text-field(v-model="post_message" type="text" label='Message*' required)
                  v-col(cols="12")                          
                    v-file-input(
                      accept="video/mp4, video/ogg" 
                      placeholder="Upload" 
                      prepend-icon="mdi-video"
                      label="Practice Video"
                      v-model="post_file")
            v-form(ref="tutorform" v-else)
              v-container
                v-row
                  v-col(cols='12')
                    v-text-field(v-model="post_message" type="text" label='Message*' required)
                  v-col(cols='12')
                    v-subheader.pl-0 Grade
                    v-slider(v-model="post_grade" min='0' max='100' thumb-label :thumb-size="24")
                  v-col(cols="12")                          
                    v-file-input(
                      accept="video/mp4, video/ogg" 
                      placeholder="Feedback" 
                      prepend-icon="mdi-video"
                      label="Feedback Video"
                      v-model="post_file")
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

export default {
  name: 'ShowLesson',
  props: ['lesson'],
  data () {
    return {
      numberOfBars: 4,
      bpm: 60,
      timeSignature: '',
      handler: {},
      disable: true,
      save_btn_loading: false,
      add_btn_loading: false,
      description: '',
      melody: [],
      options: {
        controls: true,
        fluid: true,
        sources: [
          {
            //src: this.lesson.exercises[0].demoUrl,
            src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            type: "video/mp4"
          }
        ]
      },
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
      post_message: '',
      post_file: null,
      post_grade: '',
      error: null
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

    async student_create_post () {
      var formValidated = false
      if (this.is_student) {
        formValidated = this.$refs.studentform.validate()
      } else {
        formValidated = this.$refs.tutorform.validate()
      }

      if (formValidated) {
        alert('form is gd')
        var formData = new FormData()
        formData.set('tid', this.lesson.thread.id)
        formData.set('message', this.post_message)
        formData.set('grade', this.post_grade)
        formData.append('video', this.post_file)
        const response = await PostService.create(formData)
        // threadResponse = await ThreadService.show(this.lesson.id, this.user.id)
        if (this.lesson.thread.posts.length == 0)
          this.lesson.thread.posts.splice(this.lesson.thread.posts.length, 0, response.data.post)
        else
          this.lesson.thread.posts.splice(this.lesson.thread.posts.length - 1, 0, response.data.post)
        this.dialog = false
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
    this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady() {
      console.log('onPlayerReady', this)
    });

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
#vexflow-wrapper {
  position: absolute;
  background-color: #FAFAFA;
  top: 0;
  left: 0;
  right: 0;
}
</style>
