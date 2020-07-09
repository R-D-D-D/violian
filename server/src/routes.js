const AuthenticationController = require('./controllers/AuthenticationController')
const SubscriptionController = require('./controllers/SubscriptionController')
const CourseController = require('./controllers/CourseController')
const LessonController = require('./controllers/LessonController')
const ExerciseController = require('./controllers/ExerciseController')
const ThreadController = require('./controllers/ThreadController')
const PostController = require('./controllers/PostController')

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

  app.get('/course/listall', 
    isAuthenticated,
    CourseController.listAll),

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

  app.get('/subscribe/get/student', 
    isAuthenticated, 
    SubscriptionController.getSubscriptionInfoOfStudent),

  app.get('/subscribe/get/course', 
    isAuthenticated, 
    SubscriptionController.getSubscriptionInfoOfCourse),

  app.get('/tutor/list', 
    isAuthenticated, 
    SubscriptionController.getAllTutors),

  // thread management
  app.get('/thread/list',
    isAuthenticated,
    ThreadController.list),

  app.post('/thread/new',
    isAuthenticated,
    ThreadController.create),

  app.delete('/thread/del',
    isAuthenticated,
    ThreadController.destroy),
  
  // post management
  app.get('/post/list',
    isAuthenticated,
    PostController.list),

  app.post('/post/new', upload.single('video'), 
    isAuthenticated,
    PostController.create),

  app.put('/post/edit', upload.single('video'), 
    isAuthenticated,
    PostController.edit),

  app.delete('/post/del',
    isAuthenticated,
    PostController.destroy)
}
  