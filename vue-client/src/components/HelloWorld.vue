<template lang="pug">
  div
    v-row 
      v-col
        h1 Intro to snare
    v-row.mx-0(justify="center")
      v-col(cols="9").pa-0
        figure#video-container
          video#video(ref="vid" controls preload="metadata")
            source(src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4")
          //- ul#video-controls.controls
          //-   li
          //-     v-btn#playpause(type='button') Play/Pause
          //-   li
          //-     v-btn#stop(type='button') Stop
          //-   li.progress
          //-     progress#progress(value='0' min='0')
          //-       span#progress-bar
          //-   li
          //-     v-btn#mute(type='button') Mute/Unmute
          //-   li
          //-     v-btn#volinc(type='button') Vol+
          //-   li
          //-     v-btn#voldec(type='button') Vol-
          //-   li
          //-     v-btn#fs Fullscreen
          v-row#video-controls.controls.justify-center(no-gutters :align="'center'")
            v-col.ma-0.pa-0.d-flex.justify-center.align-center
              v-btn#playpause(v-if="!playing")
                v-icon mdi-play
              v-btn#playpause(v-else)
                v-icon mdi-pause
              v-btn#stop
                v-icon mdi-square
              v-btn#mute
                v-icon(v-if="!muted") mdi-volume-mute 
                v-icon(v-else) mdi-volume-high
              v-btn#volinc
                v-icon mdi-volume-plus
              v-btn#voldec
                v-icon mdi-volume-minus
              v-progress-linear#progress.progress.mx-5(v-model="progress" height="8" color="indigo darken-2" rounded)
              v-btn#fs
                v-icon(v-if="!isFullScreen") mdi-fullscreen
                v-icon(v-else) mdi-fullscreen-exit

          #vexflow-wrapper
</template>

<script>
import vexUI from "@/plugins/vex";

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      handler: null,
      width: 0,
      height: 0,
      originalWidth: 0,
      originalHeight: 0,
      progress: 0,
      muted: false,
      playing: false,
      isFullScreen: false,
      volume: 0
    }
  },
  methods: {
    adjustAspectRatioForFullScreen (width, height) {
      var aspectRatio = this.originalHeight / this.originalWidth;
      var desiredHeight = width * aspectRatio;
      if (desiredHeight > height) {
        this.height = height;
        this.width = height / aspectRatio;
      } else if (desiredHeight == height) {
        this.height = height;
        this.width = width;
      } else {
        this.height = desiredHeight;
        this.width = width;
      }
      this.$store.commit("setNav", true);
    },

    adjustAspectRatioForNormalScreen () {
      this.height = "auto"
      this.width = "100%"
    }
  },
  mounted: function () {
    // no need extra height
    this.handler = new vexUI.Handler("vexflow-wrapper", {
      canEdit: false,
      numberOfStaves: 2,
      canvasProperties: {
        id: "vexflow-wrapper" + "-canvas",
        width: window.innerWidth * 9 / 12,
        height: 80 * vexUI.scale,
        tabindex: 1
		  }
    }).init();

    // need extra height
    // this.handler = new vexUI.Handler("vexflow-wrapper", {
    //   canEdit: false,
    //   numberOfStaves: 2,
    //   extraStaveHeight: true,
    //   canvasProperties: {
    //     id: "vexflow-wrapper" + "-canvas",
    //     width: window.innerWidth * 9 / 12,
    //     height: 120 * vexUI.scale,
    //     tabindex: 1
		//   }
    // }).init();

    // const videoElement = this.$refs.vid;

    // videoElement.addEventListener('loadeddata', () => {
    //   //Video should now be loaded but we can add a second check

    //   if(videoElement.readyState == 4){
    //     console.log("height", videoElement.videoHeight); // returns the intrinsic height of the video
    //     this.originalHeight = videoElement.videoHeight;
    //     console.log("width", videoElement.videoWidth); // returns the intrinsic width of the video
    //     this.originalWidth = videoElement.videoWidth;
    //     // this.adjustAspectRatioForFullScreen(window.innerWidth, window.innerHeight)
    //     this.adjustAspectRatioForNormalScreen()
    //   }
    // });

    var supportsVideo = !!document.createElement('video').canPlayType;

    if (supportsVideo) {
      // Obtain handles to main elements
      var videoContainer = document.getElementById('video-container');
      var video = document.getElementById('video');
      var videoControls = document.getElementById('video-controls');
      console.log("video playback rate", video.playbackRate)

      // Hide the default controls
      video.controls = false;

      // Display the user defined video controls
      videoControls.style.display = 'block';

      // Obtain handles to buttons and other elements
      var playpause = document.getElementById('playpause');
      var stop = document.getElementById('stop');
      var mute = document.getElementById('mute');
      var volinc = document.getElementById('volinc');
      var voldec = document.getElementById('voldec');
      var progress = document.getElementById('progress');
      //var progressBar = document.getElementById('progress-bar');
      var fullscreen = document.getElementById('fs');
      
      // Check if the browser supports the Fullscreen API
      var fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);
      // If the browser doesn't support the Fulscreen API then hide the fullscreen button
      if (!fullScreenEnabled) {
        fullscreen.style.display = 'none';
      }

      // Change the volume
      var alterVolume = function(dir) {
        var currentVolume = Math.floor(video.volume * 10) / 10;
        if (dir === '+') {
          if (currentVolume < 1) video.volume += 0.1;
        }
        else if (dir === '-') {
          if (currentVolume > 0) video.volume -= 0.1;
        }
      }

      // Set the video container's fullscreen state
      var setFullscreenData = (state) => {
        videoContainer.setAttribute('data-fullscreen', !!state);
        this.isFullScreen = state;
      }

      // Checks if the document is currently in fullscreen mode
      var isFullScreen = function() {
        return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
      }

      // Fullscreen
      var handleFullscreen = function() {
        // If fullscreen mode is active...	
        if (isFullScreen()) {
          // ...exit fullscreen mode
          // (Note: this can only be called on document)
          if (document.exitFullscreen) document.exitFullscreen();
          else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
          else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
          else if (document.msExitFullscreen) document.msExitFullscreen();
          setFullscreenData(false);
        }
        else {
          // ...otherwise enter fullscreen mode
          // (Note: can be called on document, but here the specific element is used as it will also ensure that the element's children, e.g. the custom controls, go fullscreen also)
          if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
          else if (videoContainer.mozRequestFullScreen) videoContainer.mozRequestFullScreen();
          else if (videoContainer.webkitRequestFullScreen) {
            // Safari 5.1 only allows proper fullscreen on the video element. This also works fine on other WebKit browsers as the following CSS (set in styles.css) hides the default controls that appear again, and 
            // ensures that our custom controls are visible:
            // figure[data-fullscreen=true] video::-webkit-media-controls { display:none !important; }
            // figure[data-fullscreen=true] .controls { z-index:2147483647; }
            video.webkitRequestFullScreen();
          }
          else if (videoContainer.msRequestFullscreen) videoContainer.msRequestFullscreen();
          setFullscreenData(true);
        }
      }

      // Only add the events if addEventListener is supported (IE8 and less don't support it, but that will use Flash anyway)
      if (document.addEventListener) {
        // Wait for the video's meta data to be loaded, then set the progress bar's max value to the duration of the video
        video.addEventListener('loadedmetadata', function() {
          progress.setAttribute('max', video.duration);
        });

        // Add events for all buttons
        playpause.addEventListener('click', () => {
          if (video.paused || video.ended) {
            video.play();
            this.playing = true;
          } else {
            video.pause();
            this.playing = false;
          }
        });

        video.addEventListener('click', function() {
          if (video.paused || video.ended) video.play();
          else video.pause();
        });

        // The Media API has no 'stop()' function, so pause the video and reset its time and the progress bar
        stop.addEventListener('click', () => {
          video.pause();
          video.currentTime = 0;
          this.progress = 0;
          this.playing = false;
        });
        mute.addEventListener('click', function() {
          video.muted = !video.muted;
        });
        volinc.addEventListener('click', function() {
          alterVolume('+');
        });
        voldec.addEventListener('click', function() {
          alterVolume('-');
        });
        fullscreen.addEventListener('click', function() {
          handleFullscreen();
        });

        // As the video is playing, update the progress bar
        video.addEventListener('timeupdate', () => {
          // For mobile browsers, ensure that the progress element's max attribute is set
          if (!progress.getAttribute('max')) progress.setAttribute('max', 100);
          this.progress = video.currentTime / video.duration * 100;
          //progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
        });

        // React to the user clicking within the progress bar
        progress.addEventListener('click', (e) => {
          var pos = (e.pageX  - progress.offsetLeft) / progress.offsetWidth;
          video.currentTime = pos * video.duration;
          this.progress = video.currentTime / video.duration * 100;
        });

        // Listen for fullscreen change events (from other controls, e.g. right clicking on the video itself)
        document.addEventListener('fullscreenchange', function() {
          setFullscreenData(!!(document.fullScreen || document.fullscreenElement));
        });
        document.addEventListener('webkitfullscreenchange', function() {
          setFullscreenData(!!document.webkitIsFullScreen);
        });
        document.addEventListener('mozfullscreenchange', function() {
          setFullscreenData(!!document.mozFullScreen);
        });
        document.addEventListener('msfullscreenchange', function() {
          setFullscreenData(!!document.msFullscreenElement);
        });
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* 
#vexflow-wrapper {
  position: absolute;
  background-color: #F5F5F5;
  width: 75%;
}

.v-row {
  position: relative;
  z-index: -1;
} */

#test {
  width: 20px;
}

figure {
	width:100%;
  height:auto;
}

video {
	width:100%;
	height:auto;
}

/* controls */
/* .controls, .controls li {
	padding:0;
	margin:0;
} */
/* .controls {
	display:none;
	list-style-type:none;
	overflow:hidden;
	background:transparent;
}
.controls li {
	float:left;
	width:10%;
	margin-left:0.3%;
}
.controls li:first-child {
	margin-left:0;
}
*/

.controls .progress {
	cursor:pointer;
}

/*
.controls button {
	width:100%;
	text-align:center;
	overflow:hidden;
	white-space:nowrap;
  	text-overflow:ellipsis;
}
.controls progress {
	display:block;
	width:100%;
	height:20px;
	height:1.25rem;
	margin-top:2px;
	margin-top:0.125rem;
	border:1px solid #aaa;
	overflow:hidden;
	-moz-border-radius:5px;
	-webkit-border-radius:5px;
	border-radius:5px;
}
.controls progress span {
	width:0%;
	height:100%;
	display:inline-block;
	background-color:#2a84cd;	
} */

/* fullscreen */
html:-ms-fullscreen {
	width:100%;
}
:-webkit-full-screen {
	background-color:transparent;
}
/* hide controls on fullscreen with WebKit */
figure[data-fullscreen=true] video::-webkit-media-controls {
	display:none !important;
}
figure[data-fullscreen=true] {
	max-width:100%;
	width:100%;
	margin:0;
	padding:0;
}
figure[data-fullscreen=true] video {
	height:auto;
}
figure[data-fullscreen=true] figcaption {
	display:none;
}
figure[data-fullscreen=true] .controls {
	position:absolute;
	bottom:2%;
	width:100%;
	z-index:2147483647;
}
figure[data-fullscreen=true] #vexflow-wrapper {
	position:absolute;
	top:2%;
	width:100%;
  z-index:2147483647;
  background-color: #F5F5F5;
}
figure[data-fullscreen=true] .controls li {
	width:5%;
}
figure[data-fullscreen=true] .controls .progress {
	width:68%;
}
</style>
