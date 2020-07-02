<template lang="pug">
  #show-course
    v-row.py-3
      v-col
        .text-h2.font-weight-bold {{ course.name }}
    
    v-row 
      v-col.mx-5
        v-tabs.rounded(v-model="tab" background-color="indigo lighten-5" color="indigo" height="64" fixed-tabs)
          v-tab(v-for="lesson in course.lessons" :key="lesson.id") {{ lesson.name }}
          v-tab(:key="'+'")
            v-icon(left) mdi-plus
            | New Lesson
        v-tabs-items(v-model="tab")
          v-tab-item(v-for="lesson in course.lessons" :key="lesson.id")
            lesson(:lesson="lesson")
          v-tab-item(:key="'+'")
            v-card
              v-row.justify-center
                v-col(cols="6")
                  v-card-title
                    span.headline.text-h3 Lesson Details
                  v-card-text.py-0
                    v-form(ref="form")
                      v-text-field(v-model="new_name" type="text" label='Lesson name*' required :rules="nameRules")
                      v-text-field(v-model="new_duration" type="text" label='Estimated lesson duration in minutes*' required :rules="durationRules")
                          
                        //- v-col(cols='12')
                        //-   v-autocomplete(:items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']" label='Interests' multiple='')
                  v-card-actions
                    v-spacer
                    v-btn(color='indigo' text='' @click="add_lesson" :loading="add_btn_loading" x-large block) Save
                    v-spacer
                  v-card-text(v-if="error")
                    p {{ error }}

    //- v-row(justify='center')
    //-   v-dialog(v-model='dialog' persistent='' max-width='600px')
    //-     template(v-slot:activator='{ on, attrs }')
    //-     v-card
    //-       v-card-name
    //-         span.headline Rhythm Details
    //-       v-card-text.py-0
    //-         v-form(ref="form")
    //-           v-container
    //-             v-row
    //-               v-col(cols='12')
    //-                 v-text-field(v-model="new_name" type="text" label='Rhythm name*' required :rules="nameRules")
    //-             //- v-col(cols='12')
    //-             //-   v-autocomplete(:items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']" label='Interests' multiple='')
    //-       v-card-actions
    //-         v-spacer
    //-         v-btn(color='blue darken-1' text='' @click='dialog = false') Close
    //-         v-btn(color='blue darken-1' text='' @click="add_rhythm" :loading="add_btn_loading") Save
    //-       v-card-text(v-if="error")
    //-         p {{ error }}  
</template>

<script>
import Panel from "@/components/Panel";
import { mapState } from "vuex";
import ShowLesson from "@/components/Course/ShowLesson";

export default {
  name: "ShowCourse",
  data () {
    return {
      dialog: false,
      error: null,
      recording: false,
      tab: null,
      new_name: '',
      new_duration: '',
      new_melody: [],
      nameRules: [
        v => !!v || "Title is required"
      ],
      durationRules: [
        v => !!v || "Duration is required",
        v => new RegExp(/^\d+$/).test(v) || "Please input numbers only"
      ],
      add_btn_loading: false,
    }
  },
  components: {
    "panel": Panel,
    "lesson": ShowLesson
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

    course () {
      if (this.user.isStudent) {
        return this.userSubscribedCourses.filter(course => course.TutorId == this.$route.params.tutor_id && course.id == this.$route.params.course_id)[0]
      } else {
        return this.userOwnedCourses.filter(course => course.TutorId == this.$route.params.tutor_id && course.id == this.$route.params.course_id)[0]
      }
    },

    ...mapState(["user", "userSubscribedCourses", "userOwnedCourses"])
  },
  methods: {
    alert () {
      alert("testing");
    },

    // there are many rhythms in a course, display one of them
    // async display_rhythm (event, rhythm) {
    //   if (event) {
    //     // delete btn pressed
    //     if (event.target && event.target.nodeName &&  event.target.nodeName == "BUTTON") {
    //       confirm("Are you sure you want to delete?");
    //       var rhythmIdx = this.course.rhythms.indexOf(rhythm);
    //       var newCourse = utils.cloneCourse(this.course);

    //       newCourse.rhythms.splice(rhythmIdx, 1);
    //       newCourse.rhythms = utils.generateRhythmsString(newCourse.rhythms);
    //       try {
    //         await this.$store.dispatch("editRhythm", {
    //           course: this.course,
    //           newCourse: newCourse
    //         });
    //         return;
    //       } catch (err) {
    //         console.log(err);
    //         return;
    //       }
    //     }
    //   }
    //   this.active_rhythm = rhythm;
    //   this.active_rhythm_name = rhythm.name;
    //   this.disable = true;

    //   this.no_bars = rhythm.noOfBars;
    //   this.handler.changeBars(this.no_bars);

    //   this.time_signature = rhythm.timeSignature;
    //   this.handler.setTimeSignature(this.time_signature);

    //   this.bpm = rhythm.bpm;

    //   this.handler.importNotes(rhythm.rhythm, this.time_signature);
    // },

    edit_rhythm_name () {
      this.name_editable = true;
    },

    async add_lesson () {
      if (this.$refs.form.validate()) {
        this.add_btn_loading = true;
        var newLesson = {
          name: this.new_name,
          duration: parseInt(this.new_duration),
          cid: this.course.id
        };

        await this.$store.dispatch("addLesson", newLesson);
        this.add_btn_loading = false;
      }
    },

    open_dialogue () {
      this.dialog = true;
    }
  },
  mounted: function () {
    // if (this.course.rhythms) {
    //   this.display_rhythm(null, this.course.rhythms[0])
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
