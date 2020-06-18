<template lang="pug">
  #student
    panel(title="Homeworks")
      v-list
        v-list-item(v-for='rhythm in rhythms' :key='rhythm.title' @click='')
          v-list-item-icon
            v-icon(v-if='rhythm.icon' color='pink') mdi-star
          v-list-item-content
            v-list-item-title(v-text='rhythm.title')
          v-list-item-avatar
            v-img(:src='rhythm.avatar')
      v-btn(@click="playsequence") Play Sequence
    #vexflow-wrapper

    

</template>

<script>
import Panel from '@/components/Panel'
import tone from '@/plugins/tone'
import vexUI from '@/plugins/vex'

export default {
  name: 'Student',
  data () {
    return {
      rhythms: [{
        title: 'practice 1',
        rhythm: 'c/5/4 c/5/4 c/5/4 c/5/4',
        icon: true,
        avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg'
      },
      {
        title: 'practice 2',
        rhythm: 'c/5/4 c/5/4 c/5/4 c/5/4',
        avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg'
      }],
      tone: tone,
      handler: null
    }
  },
  components: {
    'panel': Panel
  },
  methods: {
    playsequence () {
      this.tone.init()
      this.tone.playSequence(60, ['C/5/4', 'C/5/4', 'C/5/4', 'C/5/4', 'b/4/4r', 'b/4/4r', 'b/4/4r', 'b/4/4r', 'b/4/4r', 'b/4/4r', 'b/4/4r', 'b/4/4r', 'b/4/4r', 'b/4/4r', 'b/4/4r', 'b/4/4r'], 3, {})
    }
  },
  mounted: function () {
    this.handler = new vexUI.UI.Handler("vexflow-wrapper").init();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
