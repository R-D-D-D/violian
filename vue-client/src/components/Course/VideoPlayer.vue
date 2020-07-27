<template lang="pug">
  div(style="font-size:14px !important;")
    video.vjs-big-play-centered(ref="videoPlayer" class="video-js" :id="`video`")

    v-row.bpm-control.pt-2(:id="`slider`" v-show="!hide")
      v-icon(color="white" large) $vuetify.icons.custom_bpm
      v-slider.pb-2(min="20" max="180" vertical color="white" track-color="rgba(115, 133, 159, 0.5)" thumb-label="always" v-model="playbackBpm")
</template>

<script>
/* eslint-disable */
import vexUI from "@/plugins/vex";
import videojs from "video.js";
import "videojs-hotkeys"
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay"
import axios from "axios"

export default {
  name: 'VideoPlayer',
  props: ['exercise', 'videoSrc'],
  data () {
    return {
      // exercise info
      numberOfBars: null,
      bpm: null,
      timeSignature: null,
      description: '',
      melody: [],
      useScore: false,
      useXml: false,
      notesInBars: null,
      playbackBpm: 0,
      videoHandler: null,

      // video events
      player: null,
      hide: true,
      timePerTwoBars: 0,
      timePerBar: 0,
      demoStartTime: 0,
      demoEndTime: null,
      currentDisplayedBar: 0,

      // osmd renderer
      videoOsmd: null,
      from: 1,
      to: 2,
    }
  },

  methods: {
    timeUpdated () {
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

    async timeUpdatedOsmd () {
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

    async drawOsmdScores () {
      // video osmd
      var background = document.createElement("div")
      background.setAttribute('id', `video-overlay-background`)
      background.style.position = "absolute";
      background.style.background = "#FAFAFA";
      background.style.top = "0";
      background.style.left = "0";
      background.style.right = "0";
      background.style.height = "130px";
      background.style.overflow = "hidden"

      var scoreWrapper = document.createElement("div")
      scoreWrapper.setAttribute('id', `video-osmd-wrapper`)
      scoreWrapper.style.position = "absolute";
      scoreWrapper.style.background = "#FAFAFA";
      scoreWrapper.style.top = "0";
      scoreWrapper.style.left = "0";
      scoreWrapper.style.right = "0";

      var score = document.createElement('div')
      background.appendChild(scoreWrapper)
      scoreWrapper.appendChild(score)
      document.getElementById(`video`).appendChild(background)

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
      let scoreXml = await axios.get(this.exercise.musicXmlUrl);    

      await this.videoOsmd.load(scoreXml.data);
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
    },

    drawScores () {
      var wrapper = document.createElement("div")
      wrapper.setAttribute('id', `video-vexflow-wrapper`)
      wrapper.style.position = "absolute";
      wrapper.style.background = "#FAFAFA";
      wrapper.style.top = "0";
      wrapper.style.left = "0";
      wrapper.style.right = "0";
      this.videoHandler = new vexUI.Handler(`video-vexflow-wrapper`, {
        canEdit: false,
        numberOfStaves: 2,
        lessStaveHeight: true,
        canvasProperties: {
          id: `video-vexflow-wrapper` + "-canvas",
          width: this.$refs.videoPlayer.offsetWidth,
          height: 80 * vexUI.scale,
          tabindex: 1
        }
      }, wrapper).init();
      
      this.notesInBars = this.videoHandler.notesToBars(this.melody, this.timeSignature)
      this.videoHandler.importNotes(this.notesInBars[0].concat(this.notesInBars[1])  , this.timeSignature)

      document.getElementById(`video`).appendChild(wrapper)
    }
  },

  watch: {
    playbackBpm: function (val) {
      if (this.bpm) {
        this.player.playbackRate(val / this.bpm)
      }
    },

    videoSrc: function (val) {
      if (val == 'video' && this.exercise.videoUrl) {
        if (this.player.src() != this.exercise.videoUrl) {
          this.player.src(this.exercise.videoUrl)
        }
      } else if (val == 'demo' && this.exercise.demoUrl) {
        if (this.player.src() != this.exercise.demoUrl) {
          this.player.src(this.exercise.demoUrl)
        }
      }
    }
  },

  mounted: async function() {
    let source = ''
    if (!this.exercise.videoUrl && !this.exercise.demoUrl) {
      source = 'undefined'
    } else {
      if (this.exercise.videoUrl) {
        source = this.exercise.videoUrl
      } else {
        source = this.exercise.demoUrl
      }
    }

    const player = videojs(this.$refs.videoPlayer, {
        controls: true,
        fluid: true,
        sources: [
          {
            src: source,
            type: "video/mp4"
          }
        ],
        playbackRates: [0.8, 0.9, 1, 1.1, 1.2],
        poster: this.exercise.demoPosterUrl ? this.exercise.demoPosterUrl : null
      }, () => {
        // console.log('onPlayerReady', this)
        player.hotkeys({
          volumeStep: 0.1,
          seekStep: 2,
          enableModifiersForNumbers: false,
          enableHoverScroll: true
        })

        if (this.exercise.useScore) {
          player.on('userinactive', () => {
            if (player.paused()) {
              this.hide = false
            } else {
              this.hide = true
            }
          })
          player.on('useractive', () => {
            this.hide = false
          })
          player.on('play', () => {
            this.hide = false
          })
          player.on('firstplay', () => {
            this.hide = false
          })
          player.on('ratechange', () => {
            this.playbackBpm = this.bpm * this.player.playbackRate()
          })
          if (this.exercise.useXml) {
            player.on('timeupdate', (e) => {
              this.timeUpdatedOsmd(e)
            })
          } else {
            player.on('timeupdate', (e) => {
              this.timeUpdated(e)
            })
          }
        }
    })

    this.player = player
    let exercise = this.exercise

    if (exercise.useScore) {
      this.useScore = exercise.useScore
      this.useXml = exercise.useXml
      this.bpm = parseInt(exercise.bpm)
      this.playbackBpm = this.bpm
      this.demoStartTime = exercise.demoStartTime
      if (exercise.useXml) {
        await this.drawOsmdScores()
        let timeSignature = this.videoOsmd.sheet.sourceMeasures[0].activeTimeSignature
        this.timeSignature = `${timeSignature.numerator}/${timeSignature.denominator}`
        this.numberOfBars = this.videoOsmd.sheet.sourceMeasures.length
      } else {
        this.melody = exercise.melody.split('-')
        this.timeSignature = exercise.timeSignature
        this.numberOfBars = parseInt(exercise.numberOfBars)
        this.drawScores()
      }
      this.timePerBar = ((parseInt(this.timeSignature.split('/')[0]) / this.bpm) * 60)
      this.timePerTwoBars = this.timePerBar * 2
      this.demoEndTime = this.demoStartTime + (this.timePerBar * this.numberOfBars)

      // attach slider
      document.getElementById(`video`).appendChild(document.getElementById(`slider`))
      document.getElementsByClassName("v-slider__track-container")[0].style.width = "5px"
      document.getElementsByClassName("v-slider__thumb-label")[0].style.color = "black"
      document.getElementsByClassName("v-slider__thumb-label")[0].style.boxShadow = "0px 0px 5px black"
    }
  }
}
</script>

<style scoped>
.hide {
  opacity: 0 !important;
  visibility: hidden !important;
}

.bpm-control {
  background-color: rgba(43, 51, 63, 0.7); 
  position: absolute; 
  bottom: 42px; 
  left: 12px; 
  width: 30px;
  visibility: visible;
  opacity: 1;
  transition: visibility 1000ms, opacity 1000ms;
}

video:focus {
  outline: none;
}

div {
  font-size: 14px !important;
}
</style>
