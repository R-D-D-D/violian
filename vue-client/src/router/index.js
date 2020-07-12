import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../components/Home"
import Register from "../components/Register"
import Student from "../components/StudentView/Student"
import LogIn from "../components/LogIn"
import ShowCourse from "../views/course/ShowCourse"
import CourseIndex from "../views/course/CourseIndex"
import NewCourse from "../views/course/NewCourse"
import TutorIndex from "../components/TutorIndex"
import Video from "../components/Video"
import CoursesThreadsIndex from "../views/thread/CoursesThreadsIndex"
import CourseThreadsIndex from "../views/thread/CourseThreadsIndex"
import ShowCourseThread from "../views/thread/ShowCourseThread"

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
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
    path: '/course/show/:course_id',
    name: 'showcourse',
    component: ShowCourse
  },
  {
    path: '/course/index',
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
  {
    path: '/courses/threads/index',
    component: CoursesThreadsIndex
  },
  {
    path: '/course/threads/index/:course_id',
    component: CourseThreadsIndex
  },
  {
    path: '/course/threads/show/:course_id/:student_id',
    component: ShowCourseThread
  }

];

const router = new VueRouter({
  routes
});

export default router;
