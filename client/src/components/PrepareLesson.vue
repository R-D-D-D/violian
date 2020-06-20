<template lang="pug">
  #prepare-lesson 
    v-row(no-gutters).pa-0
      v-col.p-0(cols='9')
        v-container.pa-0
          v-row.pa-0
            v-col.pa-0
              v-sheet(color='grey lighten-3' :height="height" dark)
                vex-ui
      v-col.p-0(cols='3')
        v-sheet.pa-8(color='indigo' :height="height" dark)
          v-container
            v-row
              v-col
                h2 Settings 
                v-select(:items="time_signatures" label='Time Signature')
                v-slider(v-model='no_bars' min='0' max='16' :label='bars_label' message="hey")
                v-slider(v-model='bpm' min='60' max='180' :label='bpm_label')
      
</template>

<script>
import VexFlowUI from '@/components/VexFlowUI'

export default {
  name: 'PrepareLesson',
  data () {
    return {
      height: '100vh',
      no_bars: 4,
      bpm: 60,
      time_signatures: ['4/4', '3/4', '2/4', '3/8', '6/8'],
      bars_label: 'No. Bars: 4',
      bpm_label: 'BPM: 60'
    }
  },
  components: {
    'vex-ui': VexFlowUI
  },
  watch: {
    bpm: function (val) {
      this.bpm_label = 'BPM: ' + val 
    },
    no_bars: function (val) {
      this.bars_label = 'No. Bars: ' + val
    }
  }
}
</script>

<style>
/* .v-sheet {
  height: 100vh;
} */
</style>
