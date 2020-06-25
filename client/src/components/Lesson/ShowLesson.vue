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
          v-row(v-else)
            v-col
              v-btn.mt-5(x-large light @click="$emit('play_sequence')" :loading="save_btn_loading")
                v-icon(left dark) mdi-play-outline
                | Play Rhythm
          v-row
            v-col
              v-btn.mt-5.record(x-large light @click="")
                v-icon(left dark color="red darken-3") mdi-circle-slice-8
                | Record
              v-btn.mt-5.stop(x-large light)
                v-icon(left dark color="red darken-3") mdi-stop-circle-outline
                | Stop

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
                v-list-item-icon(v-if="!is_student")
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
      error: null,
      recording: false
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
    },

    record () {
      // set up basic variables for app

      const record = document.querySelector('.record');
      const stop = document.querySelector('.stop');
      const soundClips = document.querySelector('.sound-clips');
      const mainSection = document.querySelector('.main-controls');

      // disable stop button while not recording

      stop.disabled = true;

      // visualiser setup - create web audio api context and canvas

      let audioCtx;

      if (navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia supported.');

        const constraints = { audio: true };
        let chunks = [];

        let onSuccess = function(stream) {
          const mediaRecorder = new MediaRecorder(stream);

          record.onclick = function() {
            mediaRecorder.start();
            console.log(mediaRecorder.state);
            console.log("recorder started");
            record.style.background = "red";

            stop.disabled = false;
            record.disabled = true;
          }

          stop.onclick = function() {
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
            console.log("recorder stopped");
            record.style.background = "";
            record.style.color = "";
            // mediaRecorder.requestData();

            stop.disabled = true;
            record.disabled = false;
          }

          mediaRecorder.onstop = function(e) {
            console.log("data available after MediaRecorder.stop() called.");

            const clipName = prompt('Enter a name for your sound clip?','My unnamed clip');

            const clipContainer = document.createElement('div');
            const clipLabel = document.createElement('p');
            const audio = document.createElement('audio');
            const deleteButton = document.createElement('button');
            const comparison = document.createElement('img');

            clipContainer.classList.add('clip', 'col-12', 'text-center');
            deleteButton.classList.add('btn', 'btn-outline-light')
            clipLabel.classList.add('text-light')
            audio.setAttribute('controls', '');
            deleteButton.textContent = 'Delete';
            comparison.src = 'resources/comparison.png';
            comparison.classList.add('col-12', 'mt-2');

            if(clipName === null) {
              clipLabel.textContent = 'My unnamed clip';
            } else {
              clipLabel.textContent = clipName;
            }

            clipContainer.appendChild(audio);
            clipContainer.appendChild(clipLabel);
            clipContainer.appendChild(deleteButton);
            soundClips.appendChild(clipContainer);
            soundClips.appendChild(comparison);

            audio.controls = true;
            const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
            chunks = [];
            const audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;
            console.log("recorder stopped");

            deleteButton.onclick = function(e) {
              let evtTgt = e.target;
              evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode.parentNode.childNodes[0]);
            }

            clipLabel.onclick = function() {
              const existingName = clipLabel.textContent;
              const newClipName = prompt('Enter a new name for your sound clip?');
              if(newClipName === null) {
                clipLabel.textContent = existingName;
              } else {
                clipLabel.textContent = newClipName;
              }
            }
          }

          mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
          }
        }

        let onError = function(err) {
          console.log('The following error occured: ' + err);
        }

        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

      } else {
        console.log('getUserMedia not supported on your browser!');
      }
    }
  },
  mounted: function () {
    this.handler = new vexUI.Handler("vexflow-wrapper").init()

    this.$on('play_and_record_sequence', () => {
      const audio = document.getElementById('solution-audio')
      tone.init()
      tone.createAndRecordSequence(this.time_signature, 60, this.handler.exportNotes(), 2, audio)
      tone.createAndRecordSequence(this.time_signature, this.bpm, this.handler.exportNotes(), parseInt(this.num_of_bars) + 1, audio, false, this.handler)
    })

    this.$on('play_sequence', () => {
      tone.init()
      // TODO disable edit when playing
      // this.handler.disableEdit();
      console.log(this.handler.exportNotes())
      tone.playSequence(this.time_signature, this.bpm, this.handler.exportNotes(), parseInt(this.no_bars) + 1, this.handler)
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
