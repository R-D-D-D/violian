const AuthenticationController = require('./controllers/AuthenticationController')
const SubscriptionController = require('./controllers/SubscriptionController')
const CourseController = require('./controllers/CourseController')
const LessonController = require('./controllers/LessonController')
const ExerciseController = require('./controllers/ExerciseController')

const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const isAuthenticated = require('./policies/isAuthenticated')

const multer = require('multer');
const upload = multer();

module.exports = (app) => {
  // log in
  app.post('/register', 
    AuthenticationControllerPolicy.register,  
    AuthenticationController.register),

  app.post('/login', AuthenticationController.login),

  // course management  
  app.post('/course/new', 
    isAuthenticated,
    CourseController.create),

  app.put('/course/edit', 
    isAuthenticated, 
    CourseController.edit),

  app.get('/course/list', 
    isAuthenticated,
    CourseController.list),

  app.delete('/course/del', 
    isAuthenticated,
    CourseController.destroy),

  // lesson management  
  app.post('/lesson/new', 
    isAuthenticated, 
    LessonController.create),

  app.put('/lesson/edit', 
    isAuthenticated,
    LessonController.edit),

  app.get('/lesson/list', 
    isAuthenticated,
    LessonController.list),

  app.delete('/lesson/del', 
    isAuthenticated,
    LessonController.destroy),

  // exercise management  
  app.post('/exercise/new', upload.fields(
    [{ name: 'demo', maxCount: 1 }, 
    { name: 'video', maxCount: 1 },
    { name: 'demoPoster', maxCount: 1 },
    { name: 'videoPoster', maxCount: 1 }]), 
    isAuthenticated, 
    ExerciseController.create),

  app.put('/exercise/edit', upload.fields(
    [{ name: 'demo', maxCount: 1 }, 
    { name: 'video', maxCount: 1 },
    { name: 'demoPoster', maxCount: 1 },
    { name: 'videoPoster', maxCount: 1 }]), 
    isAuthenticated, 
    ExerciseController.edit),

  app.get('/exercise/list', 
    isAuthenticated, 
    ExerciseController.list),

  app.delete('/exercise/del', 
    isAuthenticated, 
    ExerciseController.destroy),
  
  // subscription management
  app.post('/subscribe/new', 
    isAuthenticated, 
    SubscriptionController.subscribe),

  // app.get('/subscribe/get/student', SubscriptionController.getSubscriptionInfo),

  // app.get('/subscribe/get/tutor', SubscriptionController.getSubscriptionInfo),

  app.get('/subscribe/get/student', 
    isAuthenticated, 
    SubscriptionController.getSubscriptionInfoOfStudent),

  app.get('/subscribe/get/course', 
    isAuthenticated, 
    SubscriptionController.getSubscriptionInfoOfCourse),

  app.get('/tutor/list', 
    isAuthenticated, 
    SubscriptionController.getAllTutors)

/*
## lessons
- lesson management
  - POST `/lesson/new? { name, date, rhythms, userId }` - `<lessonObj>`
  - GET `/lesson/list { tutorId }` - `{ lessons: [<lessonObj>] }`
  - GET `/lesson/del { lessonId }` - `{ data: ok }`

## subscriptions
- POST `/subscribe/new { studentId, tutorId }` - `{ data: ok }`
- GET `/subscribe/student/get { studentId }` - `{ tutors: [<userObj>] }`
- GET `/subscribe/tutor/get { tutor Id }` - `{ students: [<userObj>] }`
*/
}