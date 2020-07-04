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
          video.vjs-big-play-centered(ref="videoPlayer" class="video-js" @timeupdate="timeUpdated")
          #vexflow-wrapper
          
      v-row
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

      v-row(v-else)
        v-col
          v-btn.mt-5(x-large light @click="$emit('play_sequence')" :loading="save_btn_loading")
            v-icon(left dark) mdi-play-outline
            | Play

      v-row
        v-col
          v-btn.mt-5.record(x-large light @click="")
            v-icon(left dark color="red darken-3") mdi-circle-slice-8
            | Record
          v-btn.mt-5.stop(x-large light)
            v-icon(left dark color="red darken-3") mdi-stop-circle-outline
            | Stop
  
        //- Side bar
        //- v-col(cols="3").p-0
        //-   //- v-sheet.pa-8(color='indigo' :height="height" dark)
        //-   v-card.elevation-12.pa-0(:height="height")
        //-     v-toolbar(light v-if="lesson")
        //-       v-toolbar-title.text-h4 {{ lesson.name }}
        //-       v-spacer
        //-     v-card-text.py-0(:class="{'rhythm-list-half': !is_student, 'rhythm-list-full': is_student}")
        //-       v-list(v-if="lesson")
        //-         v-list-item(v-for="rhythm in lesson.rhythms" :key="rhythm.id" @click="display_rhythm($event, rhythm)" active @dblclick="edit_rhythm_title")
        //-           v-list-item-icon
        //-             v-icon(color="pink" v-if='active_rhythm == rhythm') mdi-star
        //-             v-icon(v-else) mdi-star
        //-           v-list-item-content
        //-             v-list-item-title.text-left.text-h5(v-text='rhythm.title' v-if="!title_editable || rhythm != active_rhythm")
        //-             v-text-field#title_edit.py-0(v-model="active_rhythm_title" type="text" @input="enable_save_btn" v-else required :rules="nameRules")
        //-           v-list-item-icon(v-if="!is_student")
        //-             v-btn.delete_btn
        //-               v-icon(color="indigo" @click="") mdi-trash-can-outline
        //-     v-card-actions(v-if="!is_student")
        //-       v-spacer
        //-       v-btn#add_btn.mt-3(outlined color="indigo" @click="open_dialogue")
        //-         v-icon(left) mdi-plus-thick
        //-         |  Add Rhythm
        //-       v-spacer
        //-     v-toolbar(light flat v-if="!is_student")
        //-       v-toolbar-title Current Rhythm
        //-       v-spacer
        //-     v-card-text(v-if="!is_student")
        //-       v-select(:items="time_signatures" v-model="time_signature" label='Time Signature' @change="$emit('change_time_signature')" @click="enable_save_btn").pt-0
        //-       v-slider(v-model='no_bars' min='0' max='4' :label='bars_label' @change="$emit('change_bars')" @click="enable_save_btn")
        //-       v-slider(v-model='bpm' min='60' max='120' :label='bpm_label' @click="enable_save_btn")
</template>

<script>
import tone from "@/plugins/tone";
import vexUI from "@/plugins/vex";
import { mapState } from "vuex";
import utils from "@/utils";
import videojs from 'video.js';

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
            src: this.lesson.exercises[0].demoUrl,
            type: "video/mp4"
          }
        ]
      },
      videoHandler: null,
      hide: true,
      // videoWidth: 0,
      // videoHeight: 0,
      // originalVideoWidth: 0,
      // originalVideoHeight: 0,
      notesInBars: null,
      timePerTwoBars: 0,
      demoStartTime: 0,
      currentDisplayedBar: null
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
        console.log('in if', currBar)
        if (currBar >= this.notesInBars.length / 2)
          return
        this.currentDisplayedBar = currBar
        this.videoHandler.importNotes(this.notesInBars[currBar * 2].concat(this.notesInBars[currBar * 2 + 1]), this.timeSignature)
        return
      }
      if ((event.target.currentTime - this.demoStartTime) / this.timePerTwoBars < this.currentDisplayedBar) {
        var currBar1 = Math.floor((event.target.currentTime - this.demoStartTime) / this.timePerTwoBars)
        console.log('in else', currBar1)
        if (currBar1 < 0)
          return
        this.currentDisplayedBar = currBar1
        this.videoHandler.importNotes(this.notesInBars[currBar1 * 2].concat(this.notesInBars[currBar1 * 2 + 1]), this.timeSignature)
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

    disable_title_edit (event) {
      if (event.target.id != "title_edit") {
        this.title_editable = false;
      }
    },

    // adjustAspectRatioForFullScreen (width, height) {
    //   var aspectRatio = this.originalHeight / this.originalWidth;
    //   var desiredHeight = width * aspectRatio;
    //   if (desiredHeight > height) {
    //     this.videoHeight = height;
    //     this.videoWidth = height / aspectRatio;
    //   } else if (desiredHeight == height) {
    //     this.videoHeight = height;
    //     this.videoWidth = width;
    //   } else {
    //     this.videoHeight = desiredHeight;
    //     this.videoWidth = width;
    //   }
    // }
  },

  mounted: function () {
    // find out the aspect ratio of the video
    // const videoElement = this.$refs.videoPlayer

    // videoElement.addEventListener('loadeddata', () => {
    //   //Video should now be loaded but we can add a second check

    //   if(videoElement.readyState == 4){
    //     console.log("height", videoElement.videoHeight) // returns the intrinsic height of the video
    //     this.originalHeight = videoElement.videoHeight
    //     console.log("width", videoElement.videoWidth) // returns the intrinsic width of the video
    //     this.originalWidth = videoElement.videoWidth
    //     this.adjustAspectRatioForFullScreen(window.innerWidth, window.innerHeight)
    //   }
    // });

    this.$on("play_sequence", () => {
      tone.init();
      // TODO disable edit when playing
      // this.handler.disableEdit();
      console.log(this.handler.exportNotes());
      tone.playSequence(this.time_signature, this.bpm, this.handler.exportNotes(), parseInt(this.numberOfBars) + 1, this.handler);
      // this.handler.enableEdit();
    });

    //window.addEventListener('resize', this.onResize);
    // this generates the score
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

    this.melody = this.lesson.exercises[0].melody
    this.bpm = parseInt(this.lesson.exercises[0].bpm)
    this.timeSignature = this.lesson.exercises[0].timeSignature
    this.handler.importNotes(this.melody, this.timeSignature)
    this.description = this.lesson.description
    this.demoStartTime = parseInt(this.lesson.exercises[0].demoStartTime)
    this.numberOfBars = parseInt(this.lesson.exercises[0].numberOfBars)
    this.notesInBars = this.handler.notesToBars(this.melody, this.timeSignature)

    this.timePerTwoBars = ((parseInt(this.timeSignature.split('/')[0]) / this.bpm) * 60) * 2

    this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady() {
        console.log('onPlayerReady', this);
    });

    this.videoHandler = new vexUI.Handler("vexflow-wrapper", {
      canEdit: false,
      numberOfStaves: 2,
      lessStaveHeight: true,
      canvasProperties: {
        id: "vexflow-wrapper" + "-canvas",
        width: document.getElementById("vjs_video_3").offsetWidth,
        height: 80 * vexUI.scale,
        tabindex: 1
      }
    }).init();

    this.player.on('fullscreenchange', () => {
      if (this.player.isFullscreen_) {
        this.hide = false;
      } else {
        this.hide = true;
      }
    })

    document.getElementById("vjs_video_3").appendChild(document.getElementById("vexflow-wrapper"))
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
