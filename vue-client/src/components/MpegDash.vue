<template lang="pug">
  div 
    video.vjs-big-play-centered(ref="videoPlayer" class="video-js" :id="`video`")

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
            src: 'https://s3.amazonaws.com/_bc_dml/example-content/sintel_dash/sintel_vod.mpd',
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
