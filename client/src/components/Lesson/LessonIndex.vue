<template lang="pug">
  #lessons.mt-5
    panel(title="Upcoming Lessons")
      v-list
        v-list-item(v-for="lesson in lessons" :key="lesson.title")
          v-list-item-content
            v-list-item-title.text-h5.py-0(v-text='lesson.title')
          v-list-item-content
            v-list-item-title(v-text='lesson.date')
          v-list-item-icon
            v-btn(outlined color='indigo' @click="")
                v-icon mdi-pencil
    v-row(justify='center')
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
            v-btn(color='blue darken-1' text='' @click="submit") Save
</template>

<script>
import Panel from '@/components/Panel'
import LessonService from '@/services/LessonService'

export default {
  data () {
    return {
      lessons: [{
        title: 'Introduction to snare',
        icon: true,
        avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
        date: new Date().toISOString().substr(0, 10)
      },
      {
        title: 'Introduction to bass',
        avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
        date: new Date().toISOString().substr(0, 10)
      }],
      dialog: false,
      picker: new Date().toISOString().substr(0, 10),
      name: '',
      nameRules: [
        v => !!v || 'E-mail is required',
      ],
      pickerRules: [
        v => !!v || 'Password is required',
      ],
      validation: {
        namePassed: false,
      }
    }
  },
  components: {
    'panel': Panel
  },
  methods: {
    async createlesson () {
        const response = await LessonService.create({
          name: this.email,
          password: this.password,
          role: 'student'
        })
    },

    async submit () {
      if (this.$refs.form.validate()) {
        await LessonService.create({
          name: this.name,
          date: this.date,
          userId: this.$store.state.user ? this.$store.state.user.id : 2
        })
        //this.$router.push('/')
      }
    }
  }
}
</script>

<style>
</style>
