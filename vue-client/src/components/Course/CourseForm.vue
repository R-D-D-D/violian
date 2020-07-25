<template lang="pug">
  panel.mb-5(title="Basic Info" md="10" v-if="course")
    v-card-text
      h1(v-text="course.name")
      v-form(ref="courseForm")
        v-row
          v-col(cols="12" md="4")
            v-text-field(label='Title*' name='title' type='text' v-model='course.name' :rules="nameRules" solo clearable color="indigo")
          v-col(cols="12" md="4")
            v-text-field(label='Price*' name='price' prepend-icon='mdi-currency-usd' v-model='course.price' :rules="priceRules" solo clearable color="indigo")
          v-col(cols="12" md="4")
            v-text-field(label='Tagline' name='tagline' v-model='course.tagline' solo clearable)
        v-row
          v-col(cols="12")
            v-textarea(label="Description" auto-grow solo v-model="course.description")
        v-row
          v-col(cols="12" md="4")
            v-select(label='Level' :items="levels" v-model="course.level" solo)
          v-col(cols="12" md="4")
            v-select(label='Instrument' :items="instruments" v-model="course.instrument" solo)
          v-col(cols="12" md="4")
            v-select(label='Language' :items="languages" v-model="course.language" solo)
        v-row
          v-col
            v-btn(@click="update") Save
            v-btn(@click="cancel") Cancel
</template>

<script>
import CourseService from '@/services/CourseService'
import vexUI from "@/plugins/vex"
import {mapState} from "vuex"

export default {
  name: 'CourseForm',
  props: ['action'],
  data () {
    return {
      course: null,
      nameRules: [
        v => !!v || 'Title is required',
      ],
      error: null,
      loading: false,
      languages: ['English', 'Chinese'],
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      instruments: ['Piano', 'Guitar', 'Drum Set', 'Er Hu', 'Yang Qin', 'French Horn', 'Violin']
    }
  },

  computed: mapState(['user']),

  methods: {
    async update () {
      this.loading = true
      this.error = ''
      try {  
        // create course
        const courseResponse = await CourseService.edit(this.course)

        this.$router.push(`/course/edit/${this.course.id}`)
      } catch (err) {
        this.error = err.response.data.error
      }
    },

    cancel () {
      this.$router.push(`/course/edit/${this.course.id}`)
    }
  },

  mounted: async function () {
    let course = (await CourseService.show(this.$route.params.course_id)).data.course
    this.course = course
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
