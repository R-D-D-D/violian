<template lang="pug">
  v-container#show-course(v-if="course" fluid)
    div(v-if="is_student")
      v-row.py-3
        v-col
          h1.font-weight-bold {{ course.name }}
      v-row(v-if="!isSubscribed")
        v-col
          v-btn(x-large color="#ec5252" dark @click="subscribe") Buy now
      
      v-row.justify-center
        v-col.pa-0(cols="11")
          v-tabs.rounded(v-model="tab" background-color="indigo lighten-5" color="indigo" height="64" fixed-tabs)
            v-tab.text-h5(v-for="lesson in course.lessons" :key="lesson.id") {{ lesson.name }}
          v-tabs-items(v-model="tab" v-if="!isSubscribed")
            v-tab-item(v-for="(lesson, idx) in course.lessons" :key="lesson.id")
              lesson(:lesson="lesson")
          v-tabs-items(v-model="tab" v-else)
            v-tab-item(v-for="(lesson, idx) in course.lessons" :key="lesson.id" :disabled="idx != 0")
              lesson(:lesson="lesson")
        
    
    v-container(v-else fluid)
      v-row.py-3
        v-col
          .text-h2.font-weight-bold {{ course.name }}
      
      v-row 
        v-col
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
import CourseService from "@/services/CourseService";
import ThreadService from "@/services/ThreadService";

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

    isSubscribed () {
      if (this.is_student) {
        return this.$store.getters.isSubscribed(this.course.id)
      } else {
        return null
      }
    },

    isOwned () {
      if (!this.is_student) {
        return this.$store.getters.isOwned(this.course.id)
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
    },

    async subscribe () {
      this.$router.push(`/payment/${this.course.id}`)
    }
  },

  created: async function() {
    var response = await CourseService.show(this.$route.params.course_id)
    try {
      response.data.course.lessons = await Promise.all(response.data.course.lessons.map(async (lesson) => {
        var threadResponse = null
        this.$store.dispatch('setNotifications', this.$store.state.notifications - response.data.course.unreadTutorPost)
        threadResponse = await ThreadService.show(lesson.id, this.user.id)
        lesson.thread = threadResponse.data.thread
        return lesson
      }))
      this.course = response.data.course
    } catch (err) {
      console.log(err)
    }
  },

  mounted: function () {
    // var stripe = window.Stripe('pk_test_51H4T51AAfWaljxm1ClFL60860vpMI5QDkhWYBEu4BKU39CVAUlTNo0fdnR6CDCv3puPd8ZRxdf5z7OiCztEEZ0rk00P5a6SI0s');
    // var elements = stripe.elements();
    // var card = elements.create("card", { 
    //   style: {
    //     base: {
    //       color: "#32325d",
    //     }
    //   } 
    // });
    // console.log(document.getElementById('payment-form'))
    // console.log(document.getElementById('card-element'))
    // card.mount(document.getElementById('card-element'));
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
