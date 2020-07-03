<template lang="pug">
  #panel
    v-row(align='center' justify='center')
      v-col(cols='12' sm='10' :md='md || 6')
        v-card.elevation-8
          v-toolbar(light)
            v-toolbar-title.text-h4 {{ title }}
            v-spacer
          slot No slot defined
</template>

<script>
export default {
  name: 'Panel',
  props: ['title', 'md']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
