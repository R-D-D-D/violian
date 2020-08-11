<template lang="pug">
  div
    v-container
      v-row.mt-10
        v-col.text-left(cols="8")
          h1 Welcome to Violian!

      v-row.mb-12
        v-col(cols="8")
          v-autocomplete(v-model='model' :items='items' :loading='isLoading' :search-input.sync='search' cache-items multiple clearable hide-details hide-selected item-text='name' item-value='symbol' label='Search for a course...' solo)
            template(v-slot:no-data)
              v-list-item
                v-list-item-title
                  | Search for your favorite 
                  strong Course
            //- template(v-slot:selection='{ attr, on, item, selected }')
            //-   v-chip.white--text(v-bind='attr' :input-value='selected' color='indigo' v-on='on')
            //-     v-icon(left) mdi-coin
            //-     span(v-text='item')
            template(v-slot:item='{ item }')
              v-list-item(@click="go_to_course($event, item.id)")
                v-list-item-content {{ item.name }}

      v-divider

      v-row.mt-10
        v-col.text-left(cols="12")
          h2 Popular Courses
        v-col(v-for="course in courses" sm="6" md="4" lg="3")
          v-card.mx-auto
            v-img.white--text.align-end(v-if="course.coverPhotoUrl" height="200px" :src="course.coverPhotoUrl" gradient="to top right, rgba(0,0,0,.5), rgba(0,0,0,.5)")
              v-card-title(style="text-shadow: 1px 1px 2px #000000;") {{ course.name }}
            v-card-subtitle.pb-0.text-left {{ course.instrument }}
            v-card-text.text-left.text--primary.pb-0
              div {{ course.tagline }}
            v-card-actions
              v-btn(color='indigo' text @click="go_to_course($event, course.id)")
                | Find out more



</template>

<script>
import { mapState } from 'vuex'
import CourseService from '@/services/CourseService'
import _ from 'lodash'

export default {
  name: 'Home',
  data () {
    return {
      isLoading: false,
      items: [],
      model: null,
      search: null,
      courses: []
    }
  },

  watch: {
    model (value) {
      console.log(value)
    },

    search: _.debounce(async function (value) {
      if (value != '' &&  value != undefined) {
        this.isLoading = true
        try {
          this.items = (await CourseService.listAll(value)).data.courses
          this.isLoading = false
        } catch (err) {
          this.isLoading = false
          console.log(err)
        }
      }
    }, 700)
  },

  computed: mapState(['user', 'allCourses']),

  methods: {
    go_to_course (event, id) {
      this.$router.push({
        name: `showcourse`,
        params: {
          course_id: id
        }
      })
    },
  },

  mounted: async function () {
    this.courses = (await CourseService.listAll()).data.courses
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
