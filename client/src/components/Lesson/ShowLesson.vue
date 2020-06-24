<template lang="pug">
  #show-lesson(@click="disable_title_edit($event)")
    v-row(no-gutters)
      v-col.p-0(cols='9' background-color='grey lighten-3')
        v-sheet(color='grey lighten-4' :height="height" dark)
          #vexflow-wrapper(@click="enable_save_btn")
          v-row(v-if="!is_student")
            v-col
              v-btn.mt-5(x-large light :disabled="disable" @click="update_rhythms" :loading="save_btn_loading")
                v-icon(left dark) mdi-content-save-all-outline
                | Save Rhythm

      //- Side bar
      v-col.p-0(cols='3')
        //- v-sheet.pa-8(color='indigo' :height="height" dark)
        v-card.elevation-12.pa-0(:height="height")
          v-toolbar(light v-if="lesson")
            v-toolbar-title.text-h4 {{ lesson.name }}
            v-spacer
          v-card-text.py-0(:class="{'rhythm-list-half': !is_student, 'rhythm-list-full': is_student}")
            v-list(v-if="lesson")
              v-list-item(v-for="rhythm in lesson.rhythms" :key="rhythm.id" @click="display_rhythm($event, rhythm)" active @dblclick="edit_rhythm_title")
                v-list-item-icon
                  v-icon(color="pink" v-if='active_rhythm == rhythm') mdi-star
                  v-icon(v-else) mdi-star
                v-list-item-content
                  v-list-item-title.text-left.text-h5(v-text='rhythm.title' v-if="!title_editable || rhythm != active_rhythm")
                  v-text-field#title_edit.py-0(v-model="active_rhythm_title" type="text" @input="enable_save_btn" v-else required :rules="nameRules")
                v-list-item-icon
                  v-btn.delete_btn
                    v-icon(color="indigo" @click="") mdi-trash-can-outline
          v-card-actions(v-if="!is_student")
            v-spacer
            v-btn#add_btn.mt-3(outlined color="indigo" @click="open_dialogue")
              v-icon(left) mdi-plus-thick
              |  Add Rhythm
            v-spacer
          v-toolbar(light flat v-if="!is_student")
            v-toolbar-title Current Rhythm
            v-spacer
          v-card-text(v-if="!is_student")
            v-select(:items="time_signatures" v-model="time_signature" label='Time Signature' @change="$emit('change_time_signature')" @click="enable_save_btn").pt-0
            v-slider(v-model='no_bars' min='0' max='4' :label='bars_label' @change="$emit('change_bars')" @click="enable_save_btn")
            v-slider(v-model='bpm' min='60' max='120' :label='bpm_label' @click="enable_save_btn")
          //- v-container(fluid)
          //-   v-row
          //-     v-col
          //-       h2 Settings 
          //-       v-select(:items="time_signatures" label='Time Signature')
          //-       v-slider(v-model='no_bars' min='0' max='16' :label='bars_label' message="hey")
          //-       v-slider(v-model='bpm' min='60' max='180' :label='bpm_label')

    v-row(justify='center')
      v-dialog(v-model='dialog' persistent='' max-width='600px')
        template(v-slot:activator='{ on, attrs }')
        v-card
          v-card-title
            span.headline Rhythm Details
          v-card-text.py-0
            v-form(ref="form")
              v-container
                v-row
                  v-col(cols='12')
                    v-text-field(v-model="active_rhythm_title" type="text" label='Rhythm name*' required :rules="nameRules")
                //- v-col(cols='12')
                //-   v-autocomplete(:items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']" label='Interests' multiple='')
          v-card-actions
            v-spacer
            v-btn(color='blue darken-1' text='' @click='dialog = false') Close
            v-btn(color='blue darken-1' text='' @click="add_rhythm" :loading="add_btn_loading") Save
          v-card-text(v-if="error")
            p {{ error }}  
</template>

<script>
import tone from '@/plugins/tone'
import vexUI from '@/plugins/vex'
import Panel from '@/components/Panel'
import { mapState } from 'vuex'
import utils from '@/utils'

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
      disable: true,
      active_rhythm: null,
      active_rhythm_title: '',
      title_editable: false,
      save_btn_loading: false,
      add_btn_loading: false,
      nameRules: [
        v => !!v || 'Title is required'
      ],
      dialog: false,
      error: null
    }
  },
  components: {
    'panel': Panel
  },
  computed: {
    lesson () {
      if (!this.user.isStudent) 
        return this.$store.getters.lesson(this.$route.params.lesson_id)
      else 
        return this.$store.getters.lessonFromSubscribedTutors(this.$route.params.tutor_id, this.$route.params.lesson_id)
    },

    tutor () {
      if (this.user.isStudent)
        return this.$store.getters.tutorFromSubscribedTutors
      else 
        return null
    },

    is_student () {
      return this.user.isStudent
    },

    ...mapState(['user', 'students', 'subscribedTutors', 'lessons'])
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
    alert () {
      alert('testing')
    },

    // there are many rhythms in a lesson, display one of them
    async display_rhythm (event, rhythm) {
      if (event) {
        // delete btn pressed
        if (event.target && event.target.nodeName &&  event.target.nodeName == 'BUTTON') {
          confirm('Are you sure you want to delete?')
          var rhythmIdx = this.lesson.rhythms.indexOf(rhythm)
          var newLesson = utils.cloneLesson(this.lesson)

          newLesson.rhythms.splice(rhythmIdx, 1)
          console.log(newLesson)
          newLesson.rhythms = utils.generateRhythmsString(newLesson.rhythms)
          try {
            await this.$store.dispatch('editRhythm', {
              lesson: this.lesson,
              newLesson: newLesson
            })
            return
          } catch (err) {
            console.log(err)
            return
          }
        }
      }
      this.active_rhythm = rhythm
      this.active_rhythm_title = rhythm.title
      this.disable = true

      this.no_bars = rhythm.noOfBars
      this.handler.changeBars(this.no_bars)

      this.time_signature = rhythm.timeSignature
      this.handler.setTimeSignature(this.time_signature)

      this.bpm = rhythm.bpm

      this.handler.importNotes(rhythm.rhythm, this.time_signature)
    },

    enable_save_btn () {
      this.disable = false
    },

    edit_rhythm_title () {
      this.title_editable = true
    },

    async update_rhythms () {
      this.save_btn_loading = true
      var oldRhythmIdx = this.lesson.rhythms.indexOf(this.active_rhythm)
      // console.log('oldRhythmIdx', oldRhythmIdx)
      var newRhythm = {
        id: this.active_rhythm.id,
        title: this.active_rhythm_title,
        timeSignature: this.time_signature,
        noOfBars: this.no_bars,
        bpm: this.bpm,
        rhythm: this.handler.exportNotes()
      }

      var newLesson = utils.cloneLesson(this.lesson)
      newLesson.rhythms[oldRhythmIdx] = newRhythm
      newLesson.rhythms = utils.generateRhythmsString(newLesson.rhythms)
      await this.$store.dispatch('editRhythm', {
        lesson: this.lesson,
        newLesson: newLesson
      })
      this.save_btn_loading = false
      this.display_rhythm({}, this.lesson.rhythms[oldRhythmIdx])
    },

    disable_title_edit (event) {
      if (event.target.id != 'title_edit') {
        this.title_editable = false
      }
    },

    async add_rhythm () {
      if (this.$refs.form.validate()) {
        this.add_btn_loading = true
        var newRhythm = {
          id: this.lesson.rhythms.length > 0 ? this.lesson.rhythms[this.lesson.rhythms.length - 1].id + 1 : 1,
          title: this.active_rhythm_title,
          timeSignature: this.time_signature,
          noOfBars: this.no_bars,
          bpm: this.bpm,
          rhythm: []
        }

        var newLesson = utils.cloneLesson(this.lesson)

        newLesson.rhythms.push(newRhythm)
        newLesson.rhythms = utils.generateRhythmsString(newLesson.rhythms)

        await this.$store.dispatch('editRhythm', {
            lesson: this.lesson,
            newLesson: newLesson
        })
        this.display_rhythm({}, this.lesson.rhythms[this.lesson.rhythms.length - 1])
        this.add_btn_loading = false
        this.dialog = false
      }
    },

    open_dialogue () {
      this.dialog = true
    }
  },
  mounted: function () {
    this.handler = new vexUI.Handler("vexflow-wrapper").init()

    this.$on('play_and_record_sequence', () => {
      const audio = document.getElementById('solution-audio')
      tone.init()
      tone.createAndRecordSequence(60, this.handler.exportNotes(), 2, audio)
      tone.createAndRecordSequence(this.bpm, this.handler.exportNotes(), parseInt(this.num_of_bars) + 1, audio, false, this.handler)
    })

    this.$on('play_sequence', () => {
      tone.init()
      // TODO disable edit when playing
      // this.handler.disableEdit();
      console.log(this.handler.exportNotes())
      tone.playSequence(this.bpm, this.handler.exportNotes(), parseInt(this.num_of_bars) + 1, this.handler)
      // this.handler.enableEdit();
    })

    this.$on('change_time_signature', () => {
      this.handler.setTimeSignature(this.time_signature)
    })

    this.$on('change_bars', () => {
      this.handler.changeBars(this.no_bars)
    })
  }
}
</script>

<style>
#setting {
  width: 100%;
}

#rhythms-list-half {
  overflow: scroll;
  height: 50vh;
}

#rhythms-list-full {
  overflow: scroll;
  height: 100vh;
}

#add_btn {
  width: 70%;
}
</style>
