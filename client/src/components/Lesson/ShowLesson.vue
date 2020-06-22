<template lang="pug">
  #show-lesson 
    v-row(no-gutters)
      v-col.p-0(cols='9' background-color='grey lighten-3')
        v-sheet(color='grey lighten-4' :height="height" dark)
          #vexflow-wrapper
          v-row
            v-col
              v-btn.mt-5(x-large to="/lesson/show" light) Add Rhythm
                v-icon(right dark) mdi-plus-thick
      v-col.p-0(cols='3')
        //- v-sheet.pa-8(color='indigo' :height="height" dark)
        v-card.elevation-12.pa-0(:height="height")
          v-toolbar(light flat)
            v-toolbar-title Rhythms in lesson
            v-spacer
          v-card-text.py-0
            v-list
              v-list-item(v-for="rhythm in rhythms" :key="rhythm.title" @click="")
                v-list-item-icon
                  v-icon(v-if='rhythm.icon') mdi-star
                v-list-item-content
                  v-list-item-title(v-text='rhythm.title')
                v-spacer
              //- v-list-item
              //-   v-btn.ma-2(block outlined color="indigo")
              //-     v-icon(left='') mdi-content-save-all-outline
              //-     |  Save Lesson
          v-toolbar(light flat)
            v-toolbar-title Current Rhythm
            v-spacer
          v-card-text
            v-select(:items="time_signatures" v-model="time_signature" label='Time Signature' @change="$emit('change_time_signature')").pt-0
            v-slider(v-model='no_bars' min='0' max='4' :label='bars_label' @change="$emit('change_bars')")
            v-slider(v-model='bpm' min='60' max='120' :label='bpm_label')
          //- v-container(fluid)
          //-   v-row
          //-     v-col
          //-       h2 Settings 
          //-       v-select(:items="time_signatures" label='Time Signature')
          //-       v-slider(v-model='no_bars' min='0' max='16' :label='bars_label' message="hey")
          //-       v-slider(v-model='bpm' min='60' max='180' :label='bpm_label')
      
</template>

<script>
import tone from '@/plugins/tone'
import vexUI from '@/plugins/vex'
import Panel from '@/components/Panel'

export default {
  name: 'ShowLesson',
  data () {
    return {
      height: '100vh',
      no_bars: 4,
      bpm: 60,
      time_signatures: ['4/4', '3/4', '2/4', '3/8', '6/8'],
      time_signature: '4/4',
      bars_label: 'No. Bars: 4',
      bpm_label: 'BPM: 60',
      handler: {},
      rhythms: [{
        title: 'Practice 1',
        icon: true,
        avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg'
      },
      {
        title: 'Practice 2',
        avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg'
      }],
    }
  },
  components: {
    'panel': Panel
  },
  watch: {
    bpm: function (val) {
      this.bpm_label = 'BPM: ' + val 
    },
    no_bars: function (val) {
      this.bars_label = 'No. Bars: ' + val
    }
  },
  methods: {

  },
  mounted: function () {
    this.handler = new vexUI.UI.Handler("vexflow-wrapper").init()

      this.$on('play_and_record_sequence', () => {
        const audio = document.getElementById('solution-audio')
        tone.init();
        tone.createAndRecordSequence(60, this.handler.exportNotes(), 2, audio)
        tone.createAndRecordSequence(this.bpm, this.handler.exportNotes(), parseInt(this.num_of_bars) + 1, audio, false, this.handler)
      });

      this.$on('play_sequence', () => {
        tone.init();
        //TODO disable edit when playing
        //this.handler.disableEdit();
        console.log(this.handler.exportNotes())
        tone.playSequence(this.bpm, this.handler.exportNotes(), parseInt(this.num_of_bars) + 1, this.handler)
        //this.handler.enableEdit();
      });

      this.$on('change_time_signature', () => {
        this.handler.setTimeSignature(this.time_signature)
      });

      this.$on('change_bars', () => {
        this.handler.changeBars(this.no_bars)
      });
  }
}
</script>

<style>
#setting {
  width: 100%;
}
</style>
