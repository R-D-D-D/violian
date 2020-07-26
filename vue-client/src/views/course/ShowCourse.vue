<template lang="pug">
  div#show-course(v-if="course" fluid)
    v-container#course-info(fluid)
      v-row.px-sm-16.mx-md-8.mx-lg-16
        v-col(cols="12" md="8")
          v-row
            v-col.text-left
              h1(style="font-size: 40px; line-height: 1.2;").font-weight-bold {{ course.name }}
          v-row
            v-col.pt-0
              h3 {{ course.description }}

          v-row
            v-col(sm="4" lg="3")
              v-row
                v-col.pr-0(sm="4" md="3")
                  v-icon(color="white" size="30") mdi-guitar-acoustic
                v-col.my-auto(sm="8" md="9")
                  p.ma-0 Instrument: {{ course.instrument }}
            v-col(sm="4" lg="3")
              v-row
                v-col.pr-0(sm="4" md="3")
                  v-icon(color="white" size="24") mdi-earth
                v-col.my-auto(sm="8" md="9")
                  p.ma-0 {{ course.language }}
            v-col(sm="4" lg="3")
              v-row
                v-col.pr-0(sm="4" md="3")
                  v-icon(color="white" size="24") mdi-calendar-clock
                v-col.my-auto(sm="8" md="9")
                  p.ma-0 Last updated: {{ new Date(course.updatedAt).toLocaleString([], { year: 'numeric', month: 'numeric', day:'numeric'}) }}

        v-col(cols="12" md="4" v-if="is_student && !isSubscribed")
          v-card
            v-img.white--text.align-end(gradient="to top right, rgba(0,0,0,.5), rgba(0,0,0,.5)" height="200px" :src="course.coverPhotoUrl" @click="playVideo" style="cursor: pointer;")
              div(style="position: absolute; left: 0; top: 0; width: 100%; height: 100%;")
               img#play-button(:src="require('../../assets/play_button.png')" style="position: absolute; width: 60px; left: calc(50% - 30px); top: calc(50% - 30px); height: 60px;" color="white" size="62" )
               h3.text--white(style="bottom: 12px; text-align: center; position: absolute; left:0; right:0;") Preview this course
            v-row
              v-col.text-left
                h1.pl-5.font-weight-bold(style="font-size: 36px;") S${{ course.price.toFixed(2) }}
            v-row
              v-col.text-center
                v-btn(color="#ec5252" dark @click="subscribe" style="width:90%" x-large v-if="course.price == 0") Enroll Now
                v-btn(color="#ec5252" dark @click="subscribe" style="width:90%" x-large v-else) Buy Now
        v-col.my-auto(cols="12" md="4" v-if="isSubscribed || isOwned")
          v-row
            v-col.text-center
              v-btn(color="#26A69A" dark style="width:90%" x-large @click="goToLesson($event, course.lessons[0])") Start Learning!

    v-container(fluid)
      v-row.px-sm-16.mx-md-8.mx-lg-16
        v-col(cols="12")
          v-sheet.px-16.py-5(color="#fbfbf8" rounded style="border: 1px solid #E0E0E0")
            v-row
              v-col.py-0.px-0
                h2.py-3.pl-0(style="color: #3c3b37; font-size: 30px;") What you will learn
            v-row
              v-col.py-0.px-0(cols="12" md="6" v-for="learningPoint in course.learningPoints.split('&')")
                v-row
                  v-col.py-2.pr-0(cols="1")
                    v-icon.d-inline.mb-2(size="16" color="#ec5252") mdi-star
                  v-col.py-2.pr-0(cols="10")
                    p.d-inline.mb-0.text-uppercase(style="line-height:1; vertical-align: middle;") {{ learningPoint }}
    
    v-container(fluid)
      v-row.px-sm-16.mx-md-8.mx-lg-16
        v-col(cols="12")
          v-sheet.px-16.py-5
            h2.py-3(style="color: #3c3b37; font-size: 30px; font-size: 30px;") About the course
            p {{ course.description }}

    v-container(fluid)
      v-row.px-sm-16.mx-md-8.mx-lg-16
        v-col(cols="12")
          v-sheet.px-16.py-5
            v-row
              v-col.py-0.px-0
                h2.pl-0(style="color: #3c3b37; font-size: 30px;") Prerequisites for this Course
            v-row(align="start" v-for="requirement in course.requirements.split('&')")
              v-col.py-0.px-0(cols="6")
                v-row
                  v-col.pr-0(cols="1" align-self="center")
                    v-icon.d-inline.mb-2(size="30" color="#ec5252") mdi-square-small
                  v-col.pr-0(cols="10" align-self="center")
                    p.d-inline.mb-0(style="line-height:1;") {{ requirement }}
              v-col.py-0.px-0(cols="6")

    v-container(fluid)
      v-row.px-sm-16.mx-md-8.mx-lg-16
        v-col(cols="12")
          v-sheet.px-16.py-5
            v-row
              v-col.py-0.px-0
                h2.pl-0(style="color: #3c3b37; font-size: 30px;") Who's suitable for the course
            v-row(align="start" v-for="targetAudience in course.targetAudiences.split('&')")
              v-col.py-0.px-0(cols="6")
                v-row
                  v-col.pr-0.py-0(cols="1" align-self="center")
                    v-icon.d-inline.mb-2(size="30" color="#ec5252") mdi-square-small
                  v-col.pr-0(cols="10" align-self="center")
                    p.d-inline.mb-0(style="line-height:1;") {{ targetAudience }}
              v-col.py-0.px-0(cols="6")

    v-container(fluid)
      v-row.px-sm-16.mx-md-8.mx-lg-16
        v-col(cols="12")
          v-sheet.px-16.py-5
            v-row
              v-col.py-0.px-0
                h2.pl-0.pb-2(style="color: #3c3b37; font-size: 30px;") Course Content
                div(style="color: #9E9E9E; font-size: 16px;") {{ course.lessons.length }} Lessons &#8226; {{ timeConverted }} of video content
            v-row(align="start")
              v-col.px-0(cols="12")
                v-card 
                  v-toolbar(color='grey lighten-2' light flat)
                    v-toolbar-title {{ course.name }}
                    v-spacer
                    v-btn(icon)
                      v-icon mdi-unfold-more-horizontal

                  v-list
                    v-list-item(v-for='(lesson, idx) in course.lessons' :key='lesson.id' shaped :disabled="idx != 0" @click="goToLesson($event, lesson)")
                      v-list-item-icon(v-if="idx == 0")
                        v-icon(color='#ec5252') mdi-play
                      v-list-item-icon(v-else)
                        v-icon(color='rgba(0, 0, 0, 0.38)') mdi-play
                      v-list-item-content
                        v-list-item-title(v-text='lesson.name')
                      v-spacer
                      //- v-list-item-icon(v-if="idx == 0")
                      //-   div(to="/") Preview
                      v-list-item-icon
                        div {{ lesson.duration }} mins

    v-row(justify='center')
      v-dialog(v-model='dialog' max-width='calc(100vw * 0.8)' v-if="dialog")
        video(width="100%" height="auto" controls ref="videoPlayer" id='video')
          source(:src="course.previewVideoUrl" type="video/mp4")

              

                 
</template>
 
<script>
import { mapState } from "vuex"
import CourseService from "@/services/CourseService"
import ThreadService from "@/services/ThreadService"
import SubscriptionService from '@/services/SubscriptionService'
// import videojs from "video.js"

export default {
  name: "ShowCourse",
  data () {
    return {
      course: null,
      dialog: false,
      error: null,
      tab: null,
      isSubscribed: false,
      isOwned: false,
      player: null
    }
  },
  computed: {
    is_student () {
      return this.user.isStudent;
    },

    timeConverted () {
      var num = this.course.duration;
      var hours = (num / 60);
      var rhours = Math.floor(hours);
      var minutes = (hours - rhours) * 60;
      var rminutes = Math.round(minutes);
      if (rhours == 0) {
        return rminutes + " minute(s)";
      } else {
        return rhours + " hour(s) and " + rminutes + " minute(s)";
      }
    },

    ...mapState(["user"])
  },

  watch: {
    dialog (val) {
      if (val == false) {
        return false
      }
    }
  },

  methods: {
    goToLesson (event, lesson) {
      this.$router.push({
        name: `showlesson`,
        params: {
          course_id: this.course.id,
          lesson_id: lesson.id,
          course: this.course,
          lesson: lesson
        }
      })
    },

    playVideo () {
      this.dialog = true;
    },

    async subscribe () {
      if (this.course.price == 0) {
        await Promise.all(this.course.lessons.map(async lesson => {
          var response = await ThreadService.create({
            lid: lesson.id
          })
          response.data.thread.posts = []
          lesson.thread = response.data.thread
          return lesson
        })) 

        await this.$store.dispatch('subscribe', {
          studentId: this.$store.state.user.id,
          courseId: this.course.id
        })

        this.$router.push({
          name: `showlesson`,
          params: {
            course_id: this.course.id,
            lesson_id: this.course.lessons[0].id
          }
        })

      } else {
        this.$router.push(`/payment/${this.course.id}`)
      }
    }
  },

  async mounted () {
    try {
      var response = await CourseService.show(this.$route.params.course_id)
      response.data.course.lessons = await Promise.all(response.data.course.lessons.map(async (lesson) => {
        var threadResponse = null
        threadResponse = await ThreadService.show(lesson.id, this.user.id)
        lesson.thread = threadResponse.data.thread
        return lesson
      }))
      this.course = response.data.course
    } catch (err) {
      console.log(err)
    }
    if (this.user.isStudent) {
      this.isSubscribed = (await SubscriptionService.isSubscribed(this.course.id)).data.isSubscribed
    } else {
      this.isOwned = (await SubscriptionService.isOwned(this.course.id)).data.isOwned
    }

    // this.player = videojs(this.$refs.videoPlayer, {
    //   controls: true,
    //   fluid: true,
    //   sources: [
    //     {
    //       src: this.course.previewVideoUrl,
    //       type: "video/mp4"
    //     }
    //   ],
    //   playbackRates: [0.8, 0.9, 1, 1.1, 1.2],
    //   poster: this.course.coverPhotoUrl
    // })
  }
}
</script>

<style scoped>
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

#course-info {
  background-color: #1e1e1c;
  color: white;
}

#play-button:hover {
  opacity: 0.95;
}
</style>
