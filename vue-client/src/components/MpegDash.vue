<template lang="pug">
  div 
    video.vjs-big-play-centered.vjs-16-9(ref="videoPlayer" class="video-js" :id="`video`")

</template>

<script>
import videojs from 'video.js'
import 'dashjs'
import 'videojs-contrib-dash'

export default {
name: "MpegDash",
    data() {
      return {
        player: null,
      }
    },

    watch: {

    },

    methods: {

    },
    mounted() {
      this.player = videojs(this.$refs.videoPlayer, {
        controls: true,
        fluid: true,
        sources: [
          { 
            src: 'https://rhythm-academy.s3.ap-southeast-1.amazonaws.com/mpeg-dash/sample.mpd',
            type: 'application/dash+xml'
          }
        ],
        playbackRates: [0.8, 0.9, 1, 1.1, 1.2],
      })
    }
}
</script>

<style scoped>
</style>
