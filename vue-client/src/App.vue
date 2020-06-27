<template lang="pug">
  v-app#app
    page-header

    v-main
      v-container.pa-0(fluid)
        router-view
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import PageHeader from "./components/Header";

export default {
  name: "App",

  components: {
    'helloworld': HelloWorld,
    'page-header': PageHeader
  },

  data: () => ({
    //
  })
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
