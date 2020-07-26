import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../components/Home"
import Register from "../components/Register"
import Student from "../components/StudentView/Student"
import LogIn from "../components/LogIn"
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
import AdvancedPayment from "../views/AdvancedPayment"
import OSMD from "../components/OSMD"
import ShowLesson from "../components/Course/ShowLesson"
import CourseForm from "../views/course/CourseForm"
import LessonForm from "../views/course/LessonForm"

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
    path: '/user/index',
    name: 'userindex',
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
    path: '/advanced-payment',
    component: AdvancedPayment
  },
  {
    path: '/osmd',
    component: OSMD
  }
];

const router = new VueRouter({
  mode: 'history',
  routes: routes
});

router.beforeEach((to, from, next) => {
  if (to.name != 'login' && !store.state.isUserLoggedIn && to.name != 'home' && to.name != 'register') next({ name: 'login' });
  else next();
})


export default router;
