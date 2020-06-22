const AuthenticationController = require('./controllers/AuthenticationController')
const LessonController = require('./controllers/LessonController')
const SubscriptionController = require('./controllers/SubscriptionController')

const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')

module.exports = (app) => {
  // log in
  app.post('/register', 
    AuthenticationControllerPolicy.register,  
    AuthenticationController.register),

  app.post('/login', AuthenticationController.login),

  // lesson management  
  app.post('/lesson/new', LessonController.create),

  app.get('/lesson/list', LessonController.list),

  app.get('/lesson/del', LessonController.destroy),
  
  // subscription management
  app.post('/subscribe/new', SubscriptionController.subscribe),

  app.get('/subscribe/get/student', SubscriptionController.getStudentSubscriptionInfo),

  app.get('/subscribe/get/tutor', SubscriptionController.getTutorSubscriptionInfo)

/*
## lessons
- lesson management
  - POST `/lesson/new? { name, date, rhythms, userId}` - `<lessonObj>`
  - GET `/lesson/list { tutorId }` - `{ lessons: [<lessonObj>] }`
  - GET `/lesson/del { lessonId }` - `{ data: ok }`

## subscriptions
- POST `/subscribe/new { studentId, tutorId }` - `{ data: ok }`
- GET `/subscribe/student/get { studentId }` - `{ tutors: [<userObj>] }`
- GET `/subscribe/tutor/get { tutor Id }` - `{ students: [<userObj>] }`
*/
}