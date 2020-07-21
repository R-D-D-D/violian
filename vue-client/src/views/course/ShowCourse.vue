<template lang="pug">
  div#show-course(v-if="course" fluid)
    v-container#course-info(fluid)
      v-row.px-sm-16.mx-md-8
        v-col(cols="12" md="8")
          v-row
            v-col.text-left
              h1(style="font-size: 40px;").font-weight-bold {{ course.name }}
          v-row
            v-col.pt-0
              h3 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam orci sed mi tempus ullamcorper. Quisque vitae lacus ut ipsum ultrices rhoncus quis a arcu. Sed placerat nisl sed tellus malesuada, id ornare augue vulputate. Pellentesque laoreet ipsum quis tempor aliquet.
      
          v-row
            v-col.py-0
              h4.font-weight-bold Created by: {{ course.TutorId }}
            
          v-row
            v-col(sm="4" lg="3")
              v-row
                v-col.pr-0(sm="4" md="3")
                  v-icon(color="white" size="30") mdi-guitar-acoustic
                v-col.pl-0.my-auto(sm="8" md="9")
                  p.ma-0 Instrument: Drum
            v-col(sm="4" lg="3")
              v-row
                v-col.pr-0(sm="4" md="3")
                  v-icon(color="white" size="24") mdi-earth
                v-col.my-auto(sm="8" md="9")
                  p.ma-0 English
            v-col(sm="4" lg="3")
              v-row
                v-col.pr-0(sm="4" md="3")
                  v-icon(color="white" size="24") mdi-calendar-clock
                v-col.my-auto(sm="8" md="9")
                  p.ma-0 English

        v-col(cols="12" md="4" v-if="is_student && !isSubscribed")
          v-card
            v-img.white--text.align-end(gradient="to top right, rgba(0,0,0,.5), rgba(0,0,0,.5)" height="200px" src='https://images.pexels.com/photos/1246437/pexels-photo-1246437.jpeg?cs=srgb&dl=close-up-photo-of-person-playing-piano-1246437.jpg&fm=jpg' @click="alert('hey')" style="cursor: pointer;")
              div(style="position: absolute; left: 0; top: 0; width: 100%; height: 100%;")
               img#play-button(:src="require('../../assets/play_button.png')" style="position: absolute; width: 60px; left: calc(50% - 30px); top: calc(50% - 30px); height: 60px;" color="white" size="62" )
               h3.text--white(style="bottom: 12px; text-align: center; position: absolute; left:0; right:0;") Preview this course
            v-row
              v-col.text-left
                h1.pl-5.font-weight-bold(style="font-size: 36px;") S${{ course.price.toFixed(2) }}
            v-row
              v-col.text-center
                v-btn(color="#ec5252" dark @click="subscribe" style="width:90%" x-large) Buy now

    v-container(fluid)
      v-row.justify-center(no-gutters)
        v-col.pa-0(cols="12" md="9")
          lesson(:lesson="course.lessons[0]")
        //-   v-tabs.rounded(v-model="tab" background-color="indigo lighten-5" color="indigo" height="64" fixed-tabs)
        //-     v-tab.text-h5(v-for="lesson in course.lessons" :key="lesson.id") {{ lesson.name }}
        //-   v-tabs-items(v-model="tab" v-if="!isSubscribed")
        //-     v-tab-item(v-for="(lesson, idx) in course.lessons" :key="lesson.id")
        //-       lesson(:lesson="lesson")
        //-   v-tabs-items(v-model="tab" v-else)
        //-     v-tab-item(v-for="(lesson, idx) in course.lessons" :key="lesson.id" :disabled="idx != 0")
          //- lesson(:lesson="lesson")
        v-col.pa-0(cols="12" md="3")
          
        
          //- v-tabs.rounded(v-model="tab" background-color="indigo lighten-5" color="indigo" height="64" fixed-tabs)
          //-   v-tab.text-h4(v-for="lesson in course.lessons" :key="lesson.id") {{ lesson.name }}
          //-   v-tab.text-h4(:key="'+'")
          //-     v-icon(left) mdi-plus
          //-     | New Lesson
          //- v-tabs-items(v-model="tab")
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
  outline: none;
}

#course-info {
  background-color: #1e1e1c;
  color: white;
}

#play-button:hover {
  opacity: 0.95;
}
</style>
