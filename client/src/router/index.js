import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Register from '@/components/Register'
import Student from '@/components/Student'
import LogIn from '@/components/LogIn'
import PrepareLesson from '@/components/PrepareLesson'

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
      path: '/preparelesson',
      name: 'preparelesson',
      component: PrepareLesson
    }
  ]
})
