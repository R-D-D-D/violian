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
    isUserLoggedIn: false,
    hideNav: false
  },

  getters: {
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

    addCourse (state, course) {
      state.userOwnedCourses.push(course);
    },

    addLesson (state, lesson) {
      console.log("reached here?")
      console.log(lesson)
      const course = state.userOwnedCourses.find(course => course.id == lesson.CourseId)
      course.lessons.push(lesson)
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

    // course management
    addCourse ({commit}, course) {
      commit("addCourse", course);
    },

    // lesson management
    async addLesson ({commit}, lesson) {
      const response = await LessonService.create(lesson);
      commit("addLesson", response.data.lesson);
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
        store.dispatch("getCoursesForStudent", payload.studentId);
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
      console.log(courses)
      courses = courses.map(course => {
        course.lessons = course.lessons.map(lesson => {
          lesson.exercises = lesson.exercises.map(exercise => {
            exercise.melody = exercise.melody.split('-')
            return exercise
          })
          return lesson
        });
        return course
      })
      console.log(courses)
      commit("setUserOwnedCourses", courses);
    },

    // for student to use when logged in as student to get lessons of his subscribed tutor
    async getCoursesForStudent ({commit}, student) {
      const response = await SubscriptionService.getSubscriptionInfoOfStudent(student.id);
      var courses = response.data.courses
      courses = courses.map(course => {
        course.lessons = course.lessons.map(lesson => {
          lesson.exercises = lesson.exercises.map(exercise => {
            exercise.melody = exercise.melody.split('-')
            return exercise
          })
          return lesson
        });
      })
      commit("setUserSubscribedCourses", courses);
    },

  }
})
