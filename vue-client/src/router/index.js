import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home"
import Register from "../views/Register"
import LogIn from "../views/LogIn"
import ShowCourse from "../views/course/ShowCourse"
import CourseIndex from "../views/course/CourseIndex"
import NewCourse from "../views/course/NewCourse"
import EditCourse from "../views/course/EditCourse"
import UserIndex from "../views/UserIndex"
import Video from "../components/Video"
import CoursesThreadsIndex from "../views/thread/CoursesThreadsIndex"
import CourseThreadsIndex from "../views/thread/CourseThreadsIndex"
import ShowCourseThread from "../views/thread/ShowCourseThread"
import Payment from "../views/Payment"
import store from "../store/store"
import OSMD from "../components/OSMD"
import ShowLesson from "../components/Course/ShowLesson"
import CourseForm from "../views/course/CourseForm"
import LessonForm from "../views/course/LessonForm"
import MpegDash from "../components/MpegDash"
import AutoEvaluation from "../views/AutoEvaluation";

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
    path: '/auto-evaluation',
    name: 'autoevaluation',
    component: AutoEvaluation
  },
  {
    path: '/course/show/:course_id',
    name: 'showcourse',
    component: ShowCourse,
    props: true
  },
  {
    path: '/course/edit/:course_id',
    name: 'editcourse',
    component: EditCourse
  },
  {
    path: '/course/form/:course_id',
    name: 'courseform',
    component: CourseForm
  },
  {
    path: '/lesson/edit-form/:lesson_id',
    component: LessonForm
  },
  {
    path: '/lesson/new-form/:course_id',
    component: LessonForm
  },
  {
    path: '/course/show/:course_id/lesson/:lesson_id',
    name: 'showlesson',
    component: ShowLesson,
    props: true
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
    path: '/user/index/NiIsInR5cCI6IkpXVCJ9',
    name: 'userindex',
    beforeEnter: (to, from, next) => {
      if (store.state.user.email != 'wangrunding@gmail.com') {
        next({
          path: from.fullPath
        })
      }
      else
        next()
    },
    component: UserIndex
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
    name: 'showthread',
    component: ShowCourseThread,
    props: true
  },
  {
    path: '/payment/:course_id',
    name: 'payment',
    component: Payment
  },
  {
    path: '/osmd',
    component: OSMD
  },
  {
    path: '/mpeg-dash',
    component: MpegDash
  }
];

const router = new VueRouter({
  mode: 'history',
  routes: routes
});

router.beforeEach((to, from, next) => {
  if (to.name != 'showcourse' && to.name != 'login' && !store.state.isUserLoggedIn && to.name != 'home' && to.name != 'register') next({ name: 'login' });
  else next();
})


export default router;
