const AuthenticationController = require('./controllers/AuthenticationController')
const SubscriptionController = require('./controllers/SubscriptionController')
const CourseController = require('./controllers/CourseController')
const LessonController = require('./controllers/LessonController')
const ExerciseController = require('./controllers/ExerciseController')

const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')

const multer = require('multer');
const upload = multer();

module.exports = (app) => {
  // log in
  app.post('/register', 
    AuthenticationControllerPolicy.register,  
    AuthenticationController.register),

  app.post('/login', AuthenticationController.login),

  // course management  
  app.post('/course/new', CourseController.create),

  app.put('/course/edit', CourseController.edit),

  app.get('/course/list', CourseController.list),

  app.delete('/course/del', CourseController.destroy),

  // lesson management  
  app.post('/lesson/new', LessonController.create),

  app.put('/lesson/edit', LessonController.edit),

  app.get('/lesson/list', LessonController.list),

  app.delete('/lesson/del', LessonController.destroy),

  // exercise management  
  app.post('/exercise/new', upload.fields(
    [{ name: 'demo', maxCount: 1 }, 
    { name: 'video', maxCount: 1 },
    { name: 'demoPoster', maxCount: 1 },
    { name: 'videoPoster', maxCount: 1 }]), ExerciseController.create),

  app.put('/exercise/edit', upload.fields(
    [{ name: 'demo', maxCount: 1 }, 
    { name: 'video', maxCount: 1 },
    { name: 'demoPoster', maxCount: 1 },
    { name: 'videoPoster', maxCount: 1 }]), ExerciseController.edit),

  app.get('/exercise/list', ExerciseController.list),

  app.delete('/exercise/del', ExerciseController.destroy),
  
  // subscription management
  app.post('/subscribe/new', SubscriptionController.subscribe),

  // app.get('/subscribe/get/student', SubscriptionController.getSubscriptionInfo),

  // app.get('/subscribe/get/tutor', SubscriptionController.getSubscriptionInfo),

  app.get('/subscribe/get/student', SubscriptionController.getSubscriptionInfoOfStudent),

  app.get('/subscribe/get/course', SubscriptionController.getSubscriptionInfoOfCourse),

  app.get('/tutor/list', SubscriptionController.getAllTutors)

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