<template lang="pug">
  #show-course
    div(v-if="is_student")
      v-row.py-3
        v-col
          .text-h2.font-weight-bold {{ course.name }}
      v-row(v-if="!is_subscribed")
        v-col
          v-btn(x-large color="red darken-3" dark) Subscribe!
      
      v-row 
        v-col.mx-5
          v-tabs.rounded(v-model="tab" background-color="indigo lighten-5" color="indigo" height="64" fixed-tabs)
            v-tab.text-h4(v-for="lesson in course.lessons" :key="lesson.id") {{ lesson.name }}
          v-tabs-items(v-model="tab")
            v-tab-item(v-for="(lesson, idx) in course.lessons" :key="lesson.id" :disabled="true")
              lesson(:lesson="lesson")
        
    
    div(v-else)
      v-row.py-3
        v-col
          .text-h2.font-weight-bold {{ course.name }}
      
      v-row 
        v-col.mx-5
          v-tabs.rounded(v-model="tab" background-color="indigo lighten-5" color="indigo" height="64" fixed-tabs)
            v-tab.text-h4(v-for="lesson in course.lessons" :key="lesson.id") {{ lesson.name }}
            v-tab.text-h4(:key="'+'")
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
import CourseService from "@/services/CourseService"

export default {
  name: "ShowCourse",
  data () {
    return {
      course: null,
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
    is_student () {
      return this.user.isStudent;
    },

    is_subscribed () {
      if (this.is_student) {
        var c = this.userSubscribedCourses.find(course => course.id = this.$route.params.course_id)
        if (c)
          return true
        else
          return false
      } else {
        return null
      }
    },

    ...mapState(["user", "userSubscribedCourses", "userOwnedCourses"])
  },
  methods: {
    alert () {
      alert("testing");
    },

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

  created: async function() {
    if (this.userSubscribedCourses.find(course => course.id == this.$route.params.course_id)) {
      this.course = this.userSubscribedCourses.find(course => course.id == this.$route.params.course_id)
    } else if (this.userOwnedCourses.find(course => course.id == this.$route.params.course_id)) {
      this.course = this.userOwnedCourses.find(course => course.id == this.$route.params.course_id)
    } else {
      var response = await CourseService.show(this.$route.params.course_id)
      this.course = response.data.course
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
