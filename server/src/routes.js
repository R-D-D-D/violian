const AuthenticationController = require('./controllers/AuthenticationController')
const SubscriptionController = require('./controllers/SubscriptionController')
const CourseController = require('./controllers/CourseController')
const LessonController = require('./controllers/LessonController')
const ExerciseController = require('./controllers/ExerciseController')
const ThreadController = require('./controllers/ThreadController')
const PostController = require('./controllers/PostController')
const PaymentController = require('./controllers/PaymentController')
const UserController = require('./controllers/UserController')
const FolderController = require('./controllers/FolderController')
const FileController = require('./controllers/FileController')

const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const isAuthenticated = require('./policies/isAuthenticated')

const multer = require('multer');
const upload = multer({
  limits: { fieldSize: 1024 * 1024 * 1024 }
});

module.exports = (app) => {
  // log in
  app.post('/register', 
    AuthenticationControllerPolicy.register,  
    AuthenticationController.register),

  app.post('/login', AuthenticationController.login),

  app.post('/admin-login', 
    isAuthenticated,
    AuthenticationController.adminLogin),

  // user management
  app.get('/user/list', 
  isAuthenticated, 
  UserController.getAllUsers),

  app.get('/tutor/list', 
    isAuthenticated, 
    UserController.getAllTutors),

  app.get('/student/list', 
    isAuthenticated, 
    UserController.getAllStudents),

  // course management  
  app.post('/course/new', upload.fields(
    [{ name: 'previewVideo', maxCount: 1 }, 
    { name: 'coverPhoto', maxCount: 1 }]),  
    isAuthenticated,
    CourseController.create),

  app.put('/course/edit', upload.fields(
    [{ name: 'previewVideo', maxCount: 1 }, 
    { name: 'coverPhoto', maxCount: 1 }]), 
    isAuthenticated, 
    CourseController.edit),

  app.get('/course/list', 
    isAuthenticated,
    CourseController.list),

  app.get('/course/listall',
    CourseController.listAll),
  
  app.get('/course/show', 
    CourseController.show),

  app.delete('/course/del', 
    isAuthenticated,
    CourseController.destroy),

  // lesson management  
  app.get('/lesson/show',
    isAuthenticated,
    LessonController.show),

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
    { name: 'videoPoster', maxCount: 1 },
    { name: 'musicXml', maxCount: 1 }]), 
    isAuthenticated, 
    ExerciseController.create),

  app.put('/exercise/edit', upload.fields(
    [{ name: 'demo', maxCount: 1 }, 
    { name: 'video', maxCount: 1 },
    { name: 'demoPoster', maxCount: 1 },
    { name: 'videoPoster', maxCount: 1 },
    { name: 'musicXml', maxCount: 1 }]), 
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
  
  app.get('/subscribe/get/is-subscribed',
    isAuthenticated,
    SubscriptionController.isSubscribed),

  app.get('/subscribe/get/is-owned',
    isAuthenticated,
    SubscriptionController.isOwned),

  // thread management
  app.get('/thread/list',
    isAuthenticated,
    ThreadController.list),

  app.get('/thread/show',
    isAuthenticated,
    ThreadController.show),

  app.get('/thread/unread',
    isAuthenticated,
    ThreadController.getUnread)

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
    PostController.destroy),

  app.post('/mail',
    PostController.mail),
    
  // braintree
  app.get('/braintree-client-token',
    isAuthenticated,
    PaymentController.createClientToken),

  app.post('/braintree-checkout',
    isAuthenticated,
    PaymentController.createTransaction),

  app.post('/braintree-paypal-checkout',
    isAuthenticated,
    PaymentController.createPaypalTransaction),

  // paypal direct
  app.get('/paypal-access-token',
    isAuthenticated,
    PaymentController.generatePaypalToken),

  app.post('/paypal-new-payout',
    isAuthenticated,
    PaymentController.generatePaypalPayout),

  app.get('/paypal-client-token',
    isAuthenticated,
    PaymentController.generatePaypalClientToken),

  app.post('/paypal-create-order',
    isAuthenticated,
    PaymentController.createOrder),

  app.post('/paypal-capture-order',
    isAuthenticated,
    PaymentController.captureOrder),

  // folder
  app.get('/folder/list',
    isAuthenticated,
    FolderController.list),

  app.get('/folder/show',
    isAuthenticated,
    FolderController.show),

  app.post('/folder/new',
    isAuthenticated,
    FolderController.create),

  app.delete('/folder/del',
    isAuthenticated,
    FolderController.destroy),

  // file
  app.post('/file/new',
    upload.single('file'),
    isAuthenticated,
    FileController.create),

  app.delete('/file/del',
    isAuthenticated,
    FileController.destroy)
}
  