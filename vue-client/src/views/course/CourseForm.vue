<template lang="pug">
v-container(v-if="course")
  v-row.justify-center
    v-col(cols="12")
      v-card.text-left(outlined).mb-12
        v-card-title.display-1.px-10 Course Info
        v-divider
        v-card-text.px-10
          v-form(ref="courseForm")
            v-row
              v-col(cols="12" md="4")
                v-text-field(label='Title*' name='title' type='text' v-model='newCourse.name' outlined clearable color="indigo")
              v-col(cols="12" md="4")
                v-text-field(label='Price*' name='price' prepend-icon='mdi-currency-usd' v-model='newCourse.price' :rules="priceRules" outlined clearable color="indigo")
              v-col(cols="12" md="4")
                v-text-field(label='Tagline' name='tagline' v-model='newCourse.tagline' outlined clearable color="indigo")
            v-row
              v-col(cols="12")
                v-textarea(label="Description" auto-grow outlined v-model="newCourse.description" color="indigo")
            v-row
              v-col(cols="12" md="4")
                v-select(label='Level' :items="levels" v-model="newCourse.level" outlined color="indigo")
              v-col(cols="12" md="4")
                v-select(label='Instrument' :items="instruments" v-model="newCourse.instrument" outlined color="indigo")
              v-col(cols="12" md="4")
                v-select(label='Language' :items="languages" v-model="newCourse.language" outlined color="indigo")
            
            v-row
              v-col(cols="12" md="6")
                v-file-input(
                  accept="video/mp4, video/ogg" 
                  :placeholder="course.previewVideoUrl ? course.previewVideoUrl.split('/')[6] : 'Upload a preview video, if none is supplied, the first lesson will be displayed as preview video'" 
                  prepend-icon="mdi-video"
                  label="Preview Video"
                  v-model="newCourse.previewVideo"
                  outlined
                  color="indigo")

              v-col(cols="12" md="6")
                v-file-input(
                  accept="image/*" 
                  :placeholder="course.coverPhotoUrl ? course.coverPhotoUrl.split('/')[6] : 'Choose coverpage for your newCourse'" 
                  prepend-icon="mdi-image"
                  label="Cover Photo"
                  v-model="newCourse.coverPhoto"
                  :rules="requiredRules"
                  outlined
                  color="indigo")
            
            v-row
              v-col(cols="12")
                div(style="font-size: 16px;") What will your students learn from the newCourse?
              v-col.py-1(cols="12" v-for="(learningPoint, idx) in newCourse.learningPoints")
                v-text-field(color="indigo" label='Example: How to use pen tool in Photoshop' name='tagline' v-model='newCourse.learningPoints[idx]' outlined clearable dense hide-details :rules="alphanumricRules")
              v-col(cols="12")
                v-btn(@click="addLearningPoint" color="indigo" text) + Add an answer
            
            v-row
              v-col(cols="12")
                div(style="font-size: 16px;") Who are this newCourse for?
              v-col.py-1(cols="12" v-for="(targetAudience, idx) in newCourse.targetAudiences")
                v-text-field(color="indigo" label='Example: Kids 6-8 years old' name='tagline' v-model='newCourse.targetAudiences[idx]' outlined clearable dense hide-details :rules="alphanumricRules")
              v-col(cols="12")
                v-btn(@click="addTargetAudience" color="indigo" text) + Add an answer
            
            v-row
              v-col(cols="12")
                div(style="font-size: 18px;") What are the requirements?
              v-col.py-1(cols="12" v-for="(requirement, idx) in newCourse.requirements")
                v-text-field(color="indigo" label='Example: Photoshop software' name='tagline' v-model='newCourse.requirements[idx]' outlined clearable dense hide-details :rules="alphanumricRules")
              v-col(cols="12")
                v-btn(@click="addRequirement" color="indigo" text) + Add an answer
    
  v-row.justify-center
    v-col.text-center
      v-btn(color="indigo" @click="update" dark :loading="loading") Save
      v-btn(@click="cancel" :disabled="loading") Cancel
</template>

<script>
import CourseService from '@/services/CourseService'

export default {
  name: 'CourseForm',
  data () {
    return {
      course: null,
      newCourse: {
        name: '',
        tagline: '',
        price: '',
        description: '',
        language: '',
        level: '',
        instrument: '',
        targetAudiences: [''],
        learningPoints: [''],
        requirements: [''],
        coverPhoto: null,
        previewVideo: null,
      },
      instruments: ['Piano', 'Guitar', 'Drum Set', 'Er Hu', 'Yang Qin', 'French Horn', 'Violin', 'Body Percussion'],
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      languages: ['English', 'Chinese'],
      nameRules: [
        v => !!v || 'Title is required',
      ],
      alphanumricRules: [
        v => new RegExp("^[a-zA-Z0-9 !@#$%^*_(){}-]{0,100}$").test(v) || "You can only input alphanumeric characters",
      ],
      requiredRules: [
        v => !!v || "This field is required"
      ],
      priceRules: [
        v => !!v || "Price is required",
        v => new RegExp(/^\d+(?:\.\d{0,2})$/).test(v) || "Price must be a number with maximum 2 decimal places"
      ],
      error: null,
      loading: false,
    }
  },

  methods: {
    async update () {
      if (!this.$refs.courseForm.validate())
        return
      this.loading = true
      this.error = ''
      try {  
        // create course
        var formData = new FormData()
        formData.set('name', this.newCourse.name)
        formData.set('tagline', this.newCourse.tagline)
        formData.set('price', this.newCourse.price)
        formData.set('description', this.newCourse.description)
        formData.set('level', this.newCourse.level)
        formData.set('instrument', this.newCourse.instrument)
        formData.set('language', this.newCourse.language)
        formData.set('targetAudiences', this.newCourse.targetAudiences.filter(x => x != '' && x != null).join('&'))
        formData.set('learningPoints', this.newCourse.learningPoints.filter(x => x != '' && x != null).join('&'))
        formData.set('requirements', this.newCourse.requirements.filter(x => x != '' && x != null).join('&'))
        formData.set('id', this.course.id)

        if (this.newCourse.previewVideo) {
          formData.append('previewVideo', this.newCourse.previewVideo)
        }
        if (this.newCourse.coverPhoto) {
          formData.append('coverPhoto', this.newCourse.coverPhoto)
        }
        await CourseService.edit(formData)

        this.$router.push(`/course/edit/${this.course.id}`)
      } catch (err) {
        this.error = err.response.data.error
      }
    },

    cancel () {
      this.$router.push(`/course/edit/${this.course.id}`)
    },

    addLearningPoint () {
      this.newCourse.learningPoints.push('')
    },

    addTargetAudience () {
      this.newCourse.targetAudiences.push('')
    },

    addRequirement () {
      this.newCourse.requirements.push('')
    },
  },

  mounted: async function () {
    this.course = (await CourseService.show(this.$route.params.course_id)).data.course
    this.newCourse.name = this.course.name
    this.newCourse.tagline = this.course.tagline
    this.newCourse.price = this.course.price.toFixed(2)
    this.newCourse.description = this.course.description
    this.newCourse.language = this.course.language
    this.newCourse.level = this.course.level
    this.newCourse.instrument = this.course.instrument
    this.newCourse.targetAudiences = this.course.targetAudiences ? this.course.targetAudiences.split('&') : []
    this.newCourse.learningPoints = this.course.learningPoints ? this.course.learningPoints.split('&') : []
    this.newCourse.requirements = this.course.requirements ? this.course.requirements.split('&') : []
  }
}
</script>

<style>
</style>