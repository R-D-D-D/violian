# getting started
- `npm start` - starts server

# paths
## login
- POST `/register { email, password }` - `{ user: <userObj>, token: jwtSignedToken}`
- GET `/login { email, password }` - `{ user: <userObj>, token: jwtSignedToken}`

## lessons
- lesson management
  - POST `/lesson/new { name, date, rhythms, TutorId }` - `{ lesson: <lessonObj> }`
  - PUT `/lesson/edit { lessonObj }` - `{ lesson: <lessonObj> }`
  - GET `/lesson/list?uid=` - `{ lessons: [<lessonObj>] }`
  - DELETE `/lesson/del?lid=` - `{ data: ok }`

## subscriptions
- POST `/subscribe/new { studentId, tutorId }` - `{ data: ok }`
- GET `/subscribe/get/student?uid=` - `{ tutors: [<userObj>] }`
- GET `/subscribe/get/tutor?uid=` - `{ students: [<userObj>] }`
- GET `/tutor/list` - `{ tutors: [<userObj>] }`
