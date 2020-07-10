# getting started
- `npm start` - starts server

# paths
## login
- POST `/register { email, password }` - `{ user: <userObj>, token: jwtSignedToken}`
- GET `/login { email, password }` - `{ user: <userObj>, token: jwtSignedToken}`

## users
- GET `/student/list` - `{ students: [<userObj>] }` -- to be implemented
- GET `/tutor/list` - `{ tutors: [<userObj>] }`

## courses
- course management
  - GET `/course/list?uid=` - `{ courses: [<courseObj>] }`
  - GET `/course/listall` - `{ courses: [<courseObj>] }`
  - GET `/course/show?cid=` - `{ course: <courseObj> } gets detailed course obj including lessons`
  - POST `/course/new { name, price, description, langauge, level, instrument,  TutorId }` - `{ course: <courseObj> }`
  - PUT `/course/edit { courseObj }` - `{ course: <courseObj> }`
  - DELETE `/course/del?cid=` - `{ data: ok }`

## lessons
- lesson management
  - POST `/lesson/new { name, duration, description, video, demoVideo, cid }` - `{ lesson: <lessonObj> }`
  - PUT `/lesson/edit { lessonObj }` - `{ lesson: <lessonObj> }`
  - GET `/lesson/list?cid=` - `{ lessons: [<lessonObj>] }`
  - DELETE `/lesson/del?lid=` - `{ data: ok }`

## exercises
- exercise management
  - POST `/exercise/new { name, melody, timeSignature, bpm, demoVideo, demoPoster, explanationVideo, explanationPoster, lid }` - `{ exercise: <exerciseObj> }`
  - PUT `/exercise/edit { name, melody, timeSignature, bpm, demoVideo, demoPoster, explanationVideo, explanationPoster, eid }` - `{ exercise: <exerciseObj> }`
  - GET `/exercise/list?lid=` - `{ exercises: [<exerciseObj>] }`
  - DELETE `/exercise/del?eid=` - `{ data: ok }`

## subscriptions for student and course
- POST `/subscribe/new { studentId, courseId }` - `{ data: ok }`
- GET `/subscribe/get/student?uid=` - `{ courses: [<courseObj>] }`
- GET `/subscribe/get/course?cid=` - `{ students: [<userObj>] }`

## threads
- thread management
  - GET `/thread/list?lid=` - `{ threads: [<threadObj>] } // get threads of a specific lesson, should be called by tutor`
  - GET `/thread/show?uid=&lid=` - `{ thread: <threadObj> }`
  - POST `/thread/new { lid }` - `{ thread: threadObj }`
  - DELETE `/thread/del?tid=` - `{ data: ok }`

## posts
- post management
  - GET `/post/list?tid=` - `{ posts: [<postObj>] }` - `{ posts: [<postObj>] }`
  - GET `/post/show?pid=` - `{ post: <postObj> }`
  - POST `/post/new { video, message, grade, tid }` - `{ post: <postObj> }`
  - PUT `/post/edit { pid, video, message, grade }` - `{ post: <postObj> }`
  - DELETE `/post/del?pid=` - `{ data: ok }`