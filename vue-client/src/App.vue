<template lang="pug">
  v-app#app
    page-header

    v-main
      v-container.pa-0(fluid)
        router-view
</template>

<script>
import PageHeader from "./components/Header";

export default {
  name: "App",

  components: {
    'page-header': PageHeader
  },

  data: () => ({
    //
  })
};
</script>

<style>
@import '../node_modules/video.js/dist/video-js.css';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
