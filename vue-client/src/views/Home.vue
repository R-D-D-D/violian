<template lang="pug">
  .home
    helloword
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    'helloworld': HelloWorld
  }
};
</script>
