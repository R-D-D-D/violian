<template lang="pug">
v-container(v-if="course")
  v-row.justify-center
    v-col(cols="12")
      v-card.text-left(outlined).mb-12
        v-card-title.display-1 Course Info
        v-divider
        v-card-text
          v-form(ref="courseForm")
            v-row
              v-col(cols="12" md="4")
                v-text-field(label='Title*' name='title' type='text' v-model='course.name' outlined clearable color="indigo")
              v-col(cols="12" md="4")
                v-text-field(label='Price*' name='price' prepend-icon='mdi-currency-usd' v-model='course.price' :rules="priceRules" outlined clearable color="indigo")
              v-col(cols="12" md="4")
                v-text-field(label='Tagline' name='tagline' v-model='course.tagline' outlined clearable color="indigo")
            v-row
              v-col(cols="12")
                v-textarea(label="Description" auto-grow outlined v-model="course.description" color="indigo")
            v-row
              v-col(cols="12" md="4")
                v-select(label='Level' :items="levels" v-model="course.level" outlined color="indigo")
              v-col(cols="12" md="4")
                v-select(label='Instrument' :items="instruments" v-model="course.instrument" outlined color="indigo")
              v-col(cols="12" md="4")
                v-select(label='Language' :items="languages" v-model="course.language" outlined color="indigo")
            
            v-row
              v-col(cols="12" md="6")
                v-file-input(
                  accept="video/mp4, video/ogg" 
                  placeholder="Upload a preview video, if none is supplied, the first lesson will be displayed as preview video" 
                  prepend-icon="mdi-video"
                  label="Preview Video"
                  v-model="course.previewVideo"
                  outlined
                  color="indigo")

              v-col(cols="12" md="6")
                v-file-input(
                  accept="image/*" 
                  placeholder="Choose coverpage for your course" 
                  prepend-icon="mdi-image"
                  label="Cover Photo"
                  v-model="course.coverPhoto"
                  outlined
                  color="indigo")
            
            v-row
              v-col(cols="12")
                div(style="font-size: 16px;") What will your students learn from the course?
              v-col.py-1(cols="12" v-for="(learningPoint, idx) in learningPoints")
                v-text-field(color="indigo" label='Example: How to use pen tool in Photoshop' name='tagline' v-model='course.learningPoints[idx]' outlined clearable dense hide-details :rules="alphanumricRules")
              v-col(cols="12")
                v-btn(@click="addLearningPoint" color="indigo" text) + Add an answer
            
            v-row
              v-col(cols="12")
                div(style="font-size: 16px;") Who are this course for?
              v-col.py-1(cols="12" v-for="(targetAudience, idx) in targetAudiences")
                v-text-field(color="indigo" label='Example: Kids 6-8 years old' name='tagline' v-model='course.targetAudiences[idx]' outlined clearable dense hide-details :rules="alphanumricRules")
              v-col(cols="12")
                v-btn(@click="addTargetAudience" color="indigo" text) + Add an answer
            
            v-row
              v-col(cols="12")
                div(style="font-size: 18px;") What are the requirements?
              v-col.py-1(cols="12" v-for="(requirement, idx) in requirements")
                v-text-field(color="indigo" label='Example: Photoshop software' name='tagline' v-model='course.requirements[idx]' outlined clearable dense hide-details :rules="alphanumricRules")
              v-col(cols="12")
                v-btn(@click="addRequirement" color="indigo" text) + Add an answer
    
  v-row.justify-center
    v-col.text-center
      v-btn(color="indigo" @click="update" dark) Save
      v-btn(@click="cancel") Cancel
</template>

<script>
import CourseService from '@/services/CourseService'

export default {
  name: 'CourseForm',
  data () {
    return {
      course: null,
      alphanumricRules: [
        v => new RegExp("^[a-zA-Z0-9 !@#$%^*_(){}-]{0,100}$").test(v) || "You can only input alphanumeric characters",
      ],
    }
  },

  methods: {
    async update () {
      this.loading = true
      this.error = ''
      try {  
        // create course
        await CourseService.edit(this.course)

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
    this.course = (await CourseService.show(this.$route.params.course_id)).data.course
  }
}
</script>

<style>
</style>