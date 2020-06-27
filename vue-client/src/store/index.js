import Vue from "vue"
import Vuex from "vuex"
import LessonService from "../services/LessonService"
import SubscriptionService from "../services/SubscriptionService"
import utils from "../utils"

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    token: null,
    user: {
      id: 2,
      email: "testing@gmail.com",
      isTutor: false,
      isStudent: true
    },
    subscribedStudents: [],
    // this tutor object contains lessons that belongs to them
    subscribedTutors: [],
    allTutors: [],
    // this lessons array is for tutors when they log in as tutor
    lessons: [],
    isUserLoggedIn: true
  },

  getters: {
    lesson: state => id => {
      return state.lessons.filter(lesson => lesson.id == id)[0];
    },

    lessonFromSubscribedTutors: state => (tutor_id, lesson_id) => {
      return state.subscribedTutors.filter(tutor => tutor.id == tutor_id)[0].lessons.filter(lesson => lesson.id == lesson_id)[0];
    },

    tutorFromSubscribedTutors: state => id => {
      return state.subscribedTutors.filter(tutor => tutor.id == id)[0];
    }
  },

  mutations: {
    setToken (state, token) {
      state.token = token;
    },

    setUser (state, user) {
      state.user = user;
    },

    logIn (state) {
      state.isUserLoggedIn = true;
    },

    logOut (state) {
      state.isUserLoggedIn = false;
    },

    addLesson (state, lesson) {
      lesson.rhythms = utils.parseRhythmsString(lesson.rhythms);
      state.lessons.push(lesson);
    },

    setLessons (state, lessons) {
      state.lessons = lessons;
    },

    setAllTutors (state, tutors) {
      state.allTutors = tutors;
    },

    setTutors (state, tutors) {
      state.subscribedTutors = tutors;
    },

    setLessonsForTutor (state, payload) {
      var tutorIdx = -1
      for (var i = 0; i < state.subscribedTutors.length; i++) {
        if (state.subscribedTutors[i].id == payload.tutor.id)
          tutorIdx = i;
      }
      if (tutorIdx < 0) 
        throw new Error("Negative index");
      state.subscribedTutors[tutorIdx].lessons = payload.lessons;
    }
  },

  actions: {
    // user management
    setToken ({commit}, token) {
      commit("setToken", token);
      if (token)
        commit("logIn");
      else
        commit("logOut");
    },

    setUser ({commit}, user) {
      commit("setUser", user);
    },

    // lesson management
    addLesson ({commit}, lesson) {
      commit("addLesson", lesson);
    },

    // for tutor to use when logged in as tutor
    async getLessons ({commit}, userId) {
      try {
        var response = await LessonService.list(userId);
        var lessons = response.data.lessons.map(lesson => {
          lesson.rhythms = utils.parseRhythmsString(lesson.rhythms);
          return lesson;
        })
        commit("setLessons", lessons);
      } catch (err) {
        console.log(err);
      }
    },

    // takes in lesson, oldRhythm and newRhythm as args
    async editRhythm (store, payload) {
      try {
        await LessonService.edit({
          lessonObj: payload.newLesson
        });
        await store.dispatch("getLessons", store.state.user.id);
      } catch (err) {
        console.log(err);
      }
    },

    // subscription management
    async subscribe(store, payload) {
      try {
        await SubscriptionService.subscribe(payload);
        store.dispatch("getTutorsOfStudent", payload.studentId);
      } catch (err) {
        console.log(err);
      }
    },

    async getAllTutors ({commit}) {
      try {
        const response = await SubscriptionService.getAllTutors();
        var tutors = response.data.tutors.map(tutor => {
          tutor.lessons = null;
          return tutor;
        });
        commit("setAllTutors", tutors);
      } catch (err) {
        console.log(err);
      }
    },

    async getTutorsOfStudent ({commit}, userId) {
      try {
        const response = await SubscriptionService.getSubscriptionInfoOfStudent(userId);
        var tutors = response.data.tutors.map(tutor => {
          tutor.lessons = null;
          return tutor;
        })
        // console.log(tutors)
        commit("setTutors", tutors);
      } catch (err) {
        console.log(err);
      }
    },

    async getStudentsOfTutor ({commit}, userId) {
      try {
        const response = await SubscriptionService.getSubscriptionInfoOfTutor(userId);
        commit("setStudents", response.data.students);
      } catch (err) {
        console.log(err);
      }
    },

    // for student to use when logged in as student to get lessons of his subscribed tutor
    async getLessonsForStudent ({commit}, tutor) {
      const response = await LessonService.list(tutor.id);
      var lessons = response.data.lessons.map(lesson => {
        lesson.rhythms = utils.parseRhythmsString(lesson.rhythms)
        return lesson
      });
      commit("setLessonsForTutor", {
        tutor: tutor,
        lessons: lessons
      });
    },

  }
})
