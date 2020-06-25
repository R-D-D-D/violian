import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Register from '@/components/Register'
import Student from '@/components/StudentView/Student'
import LogIn from '@/components/LogIn'
import ShowLesson from '@/components/Lesson/ShowLesson'
import LessonIndex from '@/components/Lesson/LessonIndex'
import TutorIndex from '@/components/TutorIndex'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: HelloWorld
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: LogIn
    },
    {
      path: '/student',
      name: 'student',
      component: Student
    },
    {
      path: '/lesson/show/:tutor_id/:lesson_id',
      name: 'showlesson',
      component: ShowLesson
    },
    {
      path: '/lesson/index/:tutor_id',
      name: 'lessonindex',
      component: LessonIndex
    },
    {
      path: '/tutor/index',
      name: 'tutorindex',
      component: TutorIndex
    }
  ]
})
