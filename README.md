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
  - POST `/course/new { name, price, TutorId }` - `{ course: <courseObj> }`
  - PUT `/course/edit { courseObj }` - `{ course: <courseObj> }`
  - GET `/course/list?uid=` - `{ courses: [<courseObj>] }`
  - DELETE `/course/del?cid=` - `{ data: ok }`

## lessons
- lesson management
  - POST `/lesson/new { name, duration, cid }` - `{ lesson: <lessonObj> }`
  - PUT `/lesson/edit { lessonObj }` - `{ lesson: <lessonObj> }`
  - GET `/lesson/list?cid=` - `{ lessons: [<lessonObj>] }`
  - DELETE `/lesson/del?lid=` - `{ data: ok }`

## exercises
- exercise management
  - POST `/exercise/new { name, melody, timeSignature, bpm, demoVideo, demoPoster, explanationVideo, explanationPoster, lid }` - `{ exercise: <exerciseObj> }`
  - PUT `/exercise/edit { exerciseObj }` - `{ exercise: <exerciseObj> }`
  - GET `/exercise/list?lid=` - `{ exercises: [<exerciseObj>] }`
  - DELETE `/exercise/del?eid=` - `{ data: ok }`

<!-- 
## subscriptions for student and tutor
- POST `/subscribe/new { studentId, tutorId }` - `{ data: ok }`
- GET `/subscribe/get/student?uid=` - `{ tutors: [<userObj>] }`
- GET `/subscribe/get/tutor?uid=` - `{ students: [<userObj>] }`
- GET `/tutor/list` - `{ tutors: [<userObj>] }` -->

## subscriptions for student and course
- POST `/subscribe/new { studentId, courseId }` - `{ data: ok }`
- GET `/subscribe/get/student?uid=` - `{ courses: [<courseObj>] }`
- GET `/subscribe/get/course?cid=` - `{ students: [<userObj>] }`