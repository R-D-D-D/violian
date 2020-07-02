import Vue from "vue"
import VueRouter from "vue-router"
import HelloWorld from "../components/HelloWorld"
import Register from "../components/Register"
import Student from "../components/StudentView/Student"
import LogIn from "../components/LogIn"
import ShowCourse from "../components/Course/ShowCourse"
import CourseIndex from "../components/Course/CourseIndex"
import NewCourse from "../components/Course/NewCourse"
import TutorIndex from "../components/TutorIndex"
import Video from "../components/Video"

Vue.use(VueRouter);

const routes = [
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
    path: '/course/show/:tutor_id/:course_id',
    name: 'showcourse',
    component: ShowCourse
  },
  {
    path: '/course/index/:tutor_id',
    name: 'courseindex',
    component: CourseIndex
  },
  {
    path: '/course/new/',
    name: 'newcourse',
    component: NewCourse
  },
  {
    path: '/tutor/index',
    name: 'tutorindex',
    component: TutorIndex
  },
  {
    path: '/video',
    name: 'video',
    component: Video
  },
];

const router = new VueRouter({
  routes
});

export default router;
