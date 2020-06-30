<template lang="pug">
  #show-lesson
    v-row.py-3
      v-col
        .text-h2.font-weight-bold {{ lesson.name }}
    
    v-row 
      v-col.mx-5
        v-tabs.rounded(v-model="tab" background-color="indigo lighten-5" color="indigo")
          v-tab(v-for="rhythm in lesson.rhythms" :key="rhythm.id") {{ rhythm.title }}
        v-tabs-items(v-model="tab")
          v-tab-item(v-for="rhythm in lesson.rhythms" :key="rhythm.id")
            practice(:rhythm="rhythm")

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
                    v-text-field(v-model="new_title" type="text" label='Rhythm name*' required :rules="nameRules")
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
import Panel from "@/components/Panel";
import { mapState } from "vuex";
import utils from "@/utils";
import ShowPractice from "@/components/Lesson/ShowPractice";

export default {
  name: "ShowLesson",
  data () {
    return {
      dialog: false,
      error: null,
      recording: false,
      tab: null,
      new_title: '',
      nameRules: [
        v => !!v || "Title is required"
      ],
      add_btn_loading: false,
    }
  },
  components: {
    "panel": Panel,
    "practice": ShowPractice
  },
  computed: {
    lesson () {
      if (!this.user.isStudent) 
        return this.$store.getters.lesson(this.$route.params.lesson_id);
      else 
        return this.$store.getters.lessonFromSubscribedTutors(this.$route.params.tutor_id, this.$route.params.lesson_id);
    },

    tutor () {
      if (this.user.isStudent)
        return this.$store.getters.tutorFromSubscribedTutors;
      else 
        return null;
    },

    is_student () {
      return this.user.isStudent;
    },

    ...mapState(["user", "subscribedTutors"])
  },
  methods: {
    alert () {
      alert("testing");
    },

    // there are many rhythms in a lesson, display one of them
    // async display_rhythm (event, rhythm) {
    //   if (event) {
    //     // delete btn pressed
    //     if (event.target && event.target.nodeName &&  event.target.nodeName == "BUTTON") {
    //       confirm("Are you sure you want to delete?");
    //       var rhythmIdx = this.lesson.rhythms.indexOf(rhythm);
    //       var newLesson = utils.cloneLesson(this.lesson);

    //       newLesson.rhythms.splice(rhythmIdx, 1);
    //       newLesson.rhythms = utils.generateRhythmsString(newLesson.rhythms);
    //       try {
    //         await this.$store.dispatch("editRhythm", {
    //           lesson: this.lesson,
    //           newLesson: newLesson
    //         });
    //         return;
    //       } catch (err) {
    //         console.log(err);
    //         return;
    //       }
    //     }
    //   }
    //   this.active_rhythm = rhythm;
    //   this.active_rhythm_title = rhythm.title;
    //   this.disable = true;

    //   this.no_bars = rhythm.noOfBars;
    //   this.handler.changeBars(this.no_bars);

    //   this.time_signature = rhythm.timeSignature;
    //   this.handler.setTimeSignature(this.time_signature);

    //   this.bpm = rhythm.bpm;

    //   this.handler.importNotes(rhythm.rhythm, this.time_signature);
    // },

    edit_rhythm_title () {
      this.title_editable = true;
    },

    async add_rhythm () {
      if (this.$refs.form.validate()) {
        this.add_btn_loading = true;
        var newRhythm = {
          id: this.lesson.rhythms.length > 0 ? this.lesson.rhythms[this.lesson.rhythms.length - 1].id + 1 : 1,
          title: this.active_rhythm_title,
          timeSignature: this.time_signature,
          noOfBars: this.no_bars,
          bpm: this.bpm,
          rhythm: []
        };

        var newLesson = utils.cloneLesson(this.lesson);

        newLesson.rhythms.push(newRhythm);
        newLesson.rhythms = utils.generateRhythmsString(newLesson.rhythms);

        await this.$store.dispatch("editRhythm", {
            lesson: this.lesson,
            newLesson: newLesson
        });
        this.display_rhythm({}, this.lesson.rhythms[this.lesson.rhythms.length - 1]);
        this.add_btn_loading = false;
        this.dialog = false;
      }
    },

    open_dialogue () {
      this.dialog = true;
    }
  },
  mounted: function () {
    // if (this.lesson.rhythms) {
    //   this.display_rhythm(null, this.lesson.rhythms[0])
    // }
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

#vexflow-wrapper {
  width: 100%;
}

video:focus {
  outline: none
}
</style>
