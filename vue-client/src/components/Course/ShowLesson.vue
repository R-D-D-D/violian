<template lang="pug">
  div
    v-container(fluid)
      v-row(no-gutters)
        v-col
          div(:id="'vexflow-wrapper-' + lesson.id"  @click="enable_save_btn")

      v-row(v-if="!is_student")
        v-col
          v-btn.mt-5(x-large light :disabled="disable" @click="update_rhythms" :loading="save_btn_loading")
            v-icon(left dark) mdi-content-save-all-outline
            | Save Lesson
        v-col
          v-btn.mt-5(x-large light :disabled="disable" @click="update_rhythms" :loading="save_btn_loading")
            v-icon(left dark) mdi-content-save-all-outline
            | Edit Lesson

      v-row(v-else)
        v-col
          v-btn.mt-5(x-large light @click="$emit('play_sequence')" :loading="save_btn_loading")
            v-icon(left dark) mdi-play-outline
            | Play

      v-row
        v-col
          v-btn.mt-5.record(x-large light @click="")
            v-icon(left dark color="red darken-3") mdi-circle-slice-8
            | Record
          v-btn.mt-5.stop(x-large light)
            v-icon(left dark color="red darken-3") mdi-stop-circle-outline
            | Stop
  
        //- Side bar
        //- v-col(cols="3").p-0
        //-   //- v-sheet.pa-8(color='indigo' :height="height" dark)
        //-   v-card.elevation-12.pa-0(:height="height")
        //-     v-toolbar(light v-if="lesson")
        //-       v-toolbar-title.text-h4 {{ lesson.name }}
        //-       v-spacer
        //-     v-card-text.py-0(:class="{'rhythm-list-half': !is_student, 'rhythm-list-full': is_student}")
        //-       v-list(v-if="lesson")
        //-         v-list-item(v-for="rhythm in lesson.rhythms" :key="rhythm.id" @click="display_rhythm($event, rhythm)" active @dblclick="edit_rhythm_title")
        //-           v-list-item-icon
        //-             v-icon(color="pink" v-if='active_rhythm == rhythm') mdi-star
        //-             v-icon(v-else) mdi-star
        //-           v-list-item-content
        //-             v-list-item-title.text-left.text-h5(v-text='rhythm.title' v-if="!title_editable || rhythm != active_rhythm")
        //-             v-text-field#title_edit.py-0(v-model="active_rhythm_title" type="text" @input="enable_save_btn" v-else required :rules="nameRules")
        //-           v-list-item-icon(v-if="!is_student")
        //-             v-btn.delete_btn
        //-               v-icon(color="indigo" @click="") mdi-trash-can-outline
        //-     v-card-actions(v-if="!is_student")
        //-       v-spacer
        //-       v-btn#add_btn.mt-3(outlined color="indigo" @click="open_dialogue")
        //-         v-icon(left) mdi-plus-thick
        //-         |  Add Rhythm
        //-       v-spacer
        //-     v-toolbar(light flat v-if="!is_student")
        //-       v-toolbar-title Current Rhythm
        //-       v-spacer
        //-     v-card-text(v-if="!is_student")
        //-       v-select(:items="time_signatures" v-model="time_signature" label='Time Signature' @change="$emit('change_time_signature')" @click="enable_save_btn").pt-0
        //-       v-slider(v-model='no_bars' min='0' max='4' :label='bars_label' @change="$emit('change_bars')" @click="enable_save_btn")
        //-       v-slider(v-model='bpm' min='60' max='120' :label='bpm_label' @click="enable_save_btn")
</template>

<script>
import tone from "@/plugins/tone";
import vexUI from "@/plugins/vex";
import { mapState } from "vuex";
import utils from "@/utils";

export default {
  name: 'ShowLesson',
  props: ['lesson'],
  data () {
    return {
      no_bars: 4,
      bpm: 60,
      time_signatures: ["4/4", "3/4", "2/4", "3/8", "6/8"],
      time_signature: "4/4",
      bars_label: "No. Bars: 4",
      bpm_label: "BPM: 60",
      handler: {},
      disable: true,
      active_rhythm: null,
      active_rhythm_title: "",
      title_editable: false,
      save_btn_loading: false,
      add_btn_loading: false,
    }
  },
  watch: {
    bpm: function (val) {
      this.bpm_label = "BPM: " + val;
    },
    no_bars: function (val) {
      this.bars_label = "No. Bars: " + val;
    }
  },
  computed: {
    tutor () {
      if (this.user.isStudent)
        return this.$store.getters.tutorFromSubscribedTutors;
      else 
        return null;
    },

    is_student () {
      return this.user.isStudent;
    },

    ...mapState(["user", "students", "subscribedTutors"])
  },
  methods: {
    async update_rhythms () {
      this.save_btn_loading = true;
      var oldRhythmIdx = this.lesson.rhythms.indexOf(this.active_rhythm);
      // console.log("oldRhythmIdx", oldRhythmIdx)
      var newRhythm = {
        id: this.active_rhythm.id,
        title: this.active_rhythm_title,
        timeSignature: this.time_signature,
        noOfBars: this.no_bars,
        bpm: this.bpm,
        rhythm: this.handler.exportNotes()
      }

      var newLesson = utils.cloneLesson(this.lesson);
      newLesson.rhythms[oldRhythmIdx] = newRhythm;
      newLesson.rhythms = utils.generateRhythmsString(newLesson.rhythms);
      await this.$store.dispatch("editRhythm", {
        lesson: this.lesson,
        newLesson: newLesson
      });
      this.save_btn_loading = false;
      this.display_rhythm({}, this.lesson.rhythms[oldRhythmIdx]);
    },

    enable_save_btn () {
      this.disable = false;
    },

    disable_title_edit (event) {
      if (event.target.id != "title_edit") {
        this.title_editable = false;
      }
    }
  },

  mounted: function () {
    if (this.lesson.rhythms) {
      this.display_rhythm(null, this.lesson.rhythms[0])
    }

    this.$on("play_and_record_sequence", () => {
      const audio = document.getElementById("solution-audio");
      tone.init();
      tone.createAndRecordSequence(this.time_signature, 60, this.handler.exportNotes(), 2, audio);
      tone.createAndRecordSequence(this.time_signature, this.bpm, this.handler.exportNotes(), parseInt(this.num_of_bars) + 1, audio, false, this.handler);
    });

    this.$on("play_sequence", () => {
      tone.init();
      // TODO disable edit when playing
      // this.handler.disableEdit();
      console.log(this.handler.exportNotes());
      tone.playSequence(this.time_signature, this.bpm, this.handler.exportNotes(), parseInt(this.no_bars) + 1, this.handler);
      // this.handler.enableEdit();
    });

    this.$on("change_time_signature", () => {
      this.handler.setTimeSignature(this.time_signature);
    });

    this.$on("change_bars", () => {
      this.handler.changeBars(this.no_bars);
    });

    //window.addEventListener('resize', this.onResize);
    if (this.user.isStudent) {
      this.handler = new vexUI.Handler(`vexflow-wrapper-${this.lesson.id}`, {
        canEdit: false,
        canvasProperties: {
          width: window.innerWidth * 2 / 3
        }
      }).init();
    } else {
      this.handler = new vexUI.Handler(`vexflow-wrapper-${this.lesson.id}`).init();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
