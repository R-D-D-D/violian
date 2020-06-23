import Vue from 'vue'
import Vuex from 'vuex'
import LessonService from '@/services/LessonService'
import utils from '@/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    token: null,
    user: {
      id: 2,
      email: 'testing1@gmail.com'
    },
    students: [],
    tutors: [],
    lessons: [],
    isUserLoggedIn: true
  },

  getters: {
    getLesson: state => id => {
      return state.lessons.filter(lesson => lesson.id == id)[0]
    }
  },

  mutations: {
    setToken (state, token) {
      state.token = token
    },

    setUser (state, user) {
      state.user = user
    },

    logIn (state) {
      state.isUserLoggedIn = true
    },

    logOut (state) {
      state.isUserLoggedIn = false
    },

    addLesson (state, lesson) {
      lesson.rhythms = utils.parseRhythmsString(lesson.rhythms)
      state.lessons.push(lesson)
    },

    setLessons (state, lessons) {
      state.lessons = lessons
    },

    editRhythm (state, payload) {
      var oldLessonIdx = state.lessons.indexOf(payload.oldLesson)
      payload.newLesson.rhythms = utils.parseRhythmsString(payload.newLesson.rhythms)
      state.lessons[oldLessonIdx] = payload.newLesson
    }
  },

  actions: {
    setToken ({commit}, token) {
      commit('setToken', token)
      if (token)
        commit('logIn')
      else
        commit('logOut')
    },

    setUser ({commit}, user) {
      commit('setUser', user)
    },

    addLesson ({commit}, lesson) {
      commit('addLesson', lesson)
    },

    async getLessons ({commit}, userId) {
      try {
        var response = await LessonService.list(userId)
        var lessons = response.data.lessons.map(lesson => {
          lesson.rhythms = utils.parseRhythmsString(lesson.rhythms)
          return lesson
        })
        commit('setLessons', lessons)
      } catch (err) {
        console.log(err)
      }
    },

    // takes in lesson, oldRhythm and newRhythm as args
    async editRhythm (store, payload) {
      try {
        // clone a lesson obj
        var lesson = {
          id: payload.lesson.id,
          name: payload.lesson.name,
          TutorId: payload.lesson.TutorId,
          rhythms: payload.lesson.rhythms,
          date: payload.lesson.date
        }
        var changedRhythmIdx = payload.lesson.rhythms.indexOf(payload.oldRhythm)
        lesson.rhythms[changedRhythmIdx] = payload.newRhythm
        lesson.rhythms = utils.generateRhythmsString(lesson.rhythms)
        const response = await LessonService.edit({
          lessonObj: lesson
        })
        store.commit('editRhythm', {
          oldLesson: payload.lesson,
          newLesson: response.data.lesson
        })
      } catch (err) {
        console.log(err)
      }
    }
  }
})
