<template lang="pug">
  v-app#app
    page-header

    v-main
      router-view
</template>

<script>
import PageHeader from "./components/Header";

export default {
  name: "App",

  components: {
    'page-header': PageHeader
  },

  mounted: function () {
    // window.addEventListener('resize', () => {
    //   console.log(this.$vuetify.breakpoint.name)
    // })
  }
};
</script>

<style>
@import '../node_modules/video.js/dist/video-js.css';

p {
  font-size: 18px;
}

strong {
  font-size: 20px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #3c3b37;
    overflow-x: hidden;

  
}

.theme--light.v-card > .v-card__text {
  color: #3c3b37 !important;
}

.disabled-dom {
  pointer-events: none;
  opacity: 0.4;
}

.speech-bubble-other, .speech-bubble-self {
	position: relative;
	background: #EEEEEE;
	border-radius: .4em;
  min-height: 40px;
}

.speech-bubble-other:after {
	content: '';
	position: absolute;
	right: 0;
	top: 60%;
	width: 0;
	height: 0;
	border: 20px solid transparent;
	border-left-color: #EEEEEE;
	border-right: 0;
	border-bottom: 0;
	margin-top: -10px;
	margin-right: -18px;
}

.speech-bubble-self:after {
	content: '';
	position: absolute;
	left: 0;
	top: 60%;
	width: 0;
	height: 0;
	border: 20px solid transparent;
	border-right-color: #EEEEEE;
	border-left: 0;
	border-bottom: 0;
	margin-top: -10px;
	margin-left: -18px;
}

.timestamp {
  position: absolute;
  right: 6px;
  bottom: 3px;
  font-size: 12px;
  color: #757575;
}

.bottom-border {
  border-left: 1px solid #BDBDBD;
  border-right: 1px solid #BDBDBD;
  border-bottom: 1px solid #BDBDBD;
}

.v-expansion-panel-content__wrap {
  padding: 0 !important;
}

input:-webkit-autofill {
  -webkit-box-shadow:0 0 0 50px white inset; /* Change the color to your own background color */
  box-shadow:0 0 0 50px white inset;
  -webkit-text-fill-color: #333;
}

input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 50px white inset;/*your box-shadow*/
  box-shadow:0 0 0 50px white inset;
  -webkit-text-fill-color: #333;
}

video:focus {
  outline: none;
}

.v-breadcrumbs li:nth-child(even) {
  padding: 0 6px !important;
}
</style>
