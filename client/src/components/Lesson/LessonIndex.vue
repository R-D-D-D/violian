<template lang="pug">
  #lessons.mt-5
    panel(title="Upcoming Lessons")
      v-list(v-if="!is_student")
        v-list-item(v-for="lesson in lessons" :key="lesson.name")
          v-list-item-content
            v-list-item-title.text-h5.py-0(v-text="lesson.name")
          v-list-item-content
            v-list-item-title(v-text='lesson.date')
          v-list-item-icon
            v-btn(outlined color='indigo' @click="showlesson($event, lesson.id)")
                v-icon mdi-pencil
      v-list(v-else)
        v-list-item(v-for="lesson in tutor.lessons" :key="lesson.name" @click="showlesson($event, lesson.id)")
          v-list-item-content
            v-list-item-title.text-h5.py-0(v-text="lesson.name")
          v-list-item-content
            v-list-item-title(v-text='lesson.date')
    v-row(justify='center' v-if="!is_student")
      v-dialog(v-model='dialog' persistent='' max-width='600px')
        template(v-slot:activator='{ on, attrs }')
          v-btn.mt-5(x-large v-bind='attrs' v-on='on')
            v-icon(left dark) mdi-plus-thick
            | Add Lesson
        v-card
          v-card-title
            span.headline Lesson Details
          v-card-text.py-0
            v-form(ref="form")
              v-container
                v-row
                  v-col(cols='12')
                    v-text-field(v-model="name" type="text" label='Lesson name*' required :rules="nameRules")
                  v-col(cols='12')
                    v-date-picker.elevation-6(v-model="picker" full-width :rules="pickerRules")
                //- v-col(cols='12')
                //-   v-autocomplete(:items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']" label='Interests' multiple='')
          v-card-actions
            v-spacer
            v-btn(color='blue darken-1' text='' @click='dialog = false') Close
            v-btn(color='blue darken-1' text='' @click="submit" :loading="loading") Save
          v-card-text(v-if="error")
            p {{ error }}

</template>

<script>
import Panel from '@/components/Panel'
import LessonService from '@/services/LessonService'
import { mapState } from 'vuex'

export default {
  data () {
    return {  
      dialog: false,
      picker: new Date().toISOString().substr(0, 10),
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
      ],
      pickerRules: [
        v => !!v || 'Password is required',
      ],
      validation: {
        namePassed: false,
      },
      error: null,
      loading: false
    }
  },
  computed: {
    is_student () {
      return this.user.isStudent
    },

    tutor () {
      return this.$store.getters.tutorFromSubscribedTutors(this.$route.params.tutor_id)
    },

    ...mapState(['user', 'students', 'subscribedTutors', 'lessons'])
  },
  components: {
    'panel': Panel
  },
  methods: {
    async submit () {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.error = null
        try {
          const response = await LessonService.create({
            name: this.name,
            date: this.picker,
            TutorId: this.user ? this.user.id : 2,
            rhythms: ''
          })
          this.$store.dispatch('addLesson', response.data.lesson)
          this.dialog = false
          this.$router.push(`/lesson/show/${response.data.lesson.id}`)
        } catch (err) {
          console.log(err)
        }
      }
    },

    showlesson (event, id) {
      if (this.is_student) {
        this.$router.push(`/lesson/show/${this.tutor.id}/${id}`)
      } else {
        this.$router.push(`/lesson/show/${this.user.id}/${id}`)
      }
    }
  },
  mounted: async function () {
    // const response = await LessonService.list()
  }
}
</script>

<style>
</style>
