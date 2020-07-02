<template lang="pug">
  div 
    v-row.justify-center
      v-col(cols="10").text-center
        video(ref="videoPlayer" class="video-js")
        #vexflow-wrapper
</template>

<script>
import videojs from 'video.js';
import vexUI from "@/plugins/vex";

export default {
name: "VideoPlayer",
    data() {
      return {
        options: {
          controls: true,
          fluid: true,
          sources: [
            {
              src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              type: "video/mp4"
            }
          ],
          poster: 'https://rhythm-academy.s3-ap-southeast-1.amazonaws.com/demoPoster.JPG'
        },
        handler: null,
        hide: true
      }
    },
    mounted() {
      this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady() {
          console.log('onPlayerReady', this);
      });

      this.handler = new vexUI.Handler("vexflow-wrapper", {
        canEdit: false,
        numberOfStaves: 2,
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

<style scoped>
#vexflow-wrapper {
  position: absolute;
  background-color: #FAFAFA;
  top: 0;
  left: 0;
  right: 0;
}
</style>
