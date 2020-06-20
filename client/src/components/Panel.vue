<template lang="pug">
  #panel
    v-row(align='center' justify='center')
      v-col(cols='12' sm='10' md='6')
        v-card.elevation-12
          v-toolbar(light flat)
            v-toolbar-title {{ title }}
            v-spacer
          slot No slot defined
</template>

<script>
export default {
  name: 'Panel',
  props: ['title']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
