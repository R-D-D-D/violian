import Vue from "vue"
import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate"
import LessonService from "../services/LessonService"
import SubscriptionService from "../services/SubscriptionService"
import CourseService from "../services/CourseService"
// import ExerciseService from "../services/ExerciseService"

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  plugins: [createPersistedState()],
  state: {
    token: null,
    user: null,
    // this lessons array is for tutors when they log in as tutor
    userOwnedCourses: [],
    userSubscribedCourses: [],
    allTutors: [],
    allCourses: [],
    isUserLoggedIn: false,
    hideNav: false
  },

  getters: {
    isSubscribed: (state) => (id) => {
      var course = state.userSubscribedCourses.find(course => course.id === id)
      if (course)
        return true
      else
        return false
    },

    isOwned: (state) => (id) => {
      var course = state.userOwnedCourses.find(course => course.id === id)
      if (course)
        return true
      else
        return false
    }
  },

  mutations: {
    resetState (state) {
      Object.assign(state, {
        token: null,
        user: null,
        // this lessons array is for tutors when they log in as tutor
        userOwnedCourses: [],
        userSubscribedCourses: [],
        allTutors: [],
        allCourses: [],
        isUserLoggedIn: false,
        hideNav: false
      })
    },

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

    setAllTutors (state, tutors) {
      state.allTutors = tutors;
    },

    setUserOwnedCourses (state, courses) {
      state.userOwnedCourses = courses;
    },

    setUserSubscribedCourses (state, courses) {
      state.userSubscribedCourses = courses;
    },

    setNav (state, bool) {
      state.hideNav = bool;
    },

    setAllCourses (state, courses) {
      state.allCourses = courses;
    },

    addCourse (state, course) {
      state.userOwnedCourses.push(course);
    },

    deleteCourse (state, cid) {
      var course = state.userOwnedCourses.find(course => course.id == cid)
      var idx = state.userOwnedCourses.indexOf(course)
      if (idx >= 0)
        state.userOwnedCourses.splice(idx, 1)
      else 
        throw new Error("negative index")
    },

    deleteAllLessons (state, course) {
      var stateCourse = state.userOwnedCourses.find(c => c.id == course.id)
      stateCourse.lessons = []
    },

    addLesson (state, lesson) {
      console.log(lesson)
      const course = state.userOwnedCourses.find(course => course.id == lesson.CourseId)
      if (course.lessons == null)
        course.lessons = []

      course.lessons.push(lesson)
    },

    deleteLesson (state, lesson) {
      console.log(lesson)
      const course = state.userOwnedCourses.find(course => course.id == lesson.CourseId)
      var idx = course.lessons.indexOf(lesson)
      course.lessons.splice(idx, 1)
    },

    addExercise (state, payload) {
      console.log(payload)
      const course = state.userOwnedCourses.find(course => course.id == payload.CourseId);
      const lesson = course.lessons.find(lesson => lesson.id == payload.exercise.LessonId);
      if (lesson.exercises == null)
        lesson.exercises = [];

      lesson.exercises.push(payload.exercise);
    }
  },

  actions: {
    // user management
    setToken ({commit}, token) {
      commit("setToken", token);
      if (token)
        commit("logIn");
      else {
        commit("logOut");
        commit("resetState");
      }
    },

    setUser ({commit}, user) {
      commit("setUser", user);
    },

    // course management
    addCourse ({commit}, course) {
      commit("addCourse", course);
    },

    async getAllCourses ({commit}) {
      const response = await CourseService.listAll();
      commit('setAllCourses', response.data.courses);
    },

    async deleteCourse(store, course) {
      await Promise.all(course.lessons.map(lesson => {
        return LessonService.delete(lesson.id);
      }))
      store.commit('deleteAllLessons', course);
      await CourseService.delete(course.id);
      store.commit("deleteCourse", course.id);
    },

    // lesson management
    addLesson ({commit}, lesson) {
      commit("addLesson", lesson);
    },

    async deleteLesson({commit}, lesson) {
      await LessonService.delete(lesson.id)
      commit('deleteLesson', lesson)
    },

    addExercise ({commit}, payload) {
      commit("addExercise", payload)
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
        store.dispatch("getCoursesForStudent", {
          id: payload.studentId
        });
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

    async getCoursesForTutor ({commit}, tutor) {
      const response = await CourseService.list(tutor.id);
      var courses = response.data.courses
      commit("setUserOwnedCourses", courses);
    },

    // for student to use when logged in as student to get lessons of his subscribed tutor
    async getCoursesForStudent ({commit}, student) {
      const response = await SubscriptionService.getSubscriptionInfoOfStudent(student.id);
      var courses = response.data.courses
      commit("setUserSubscribedCourses", courses);
    },

  }
})
