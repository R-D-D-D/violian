# getting started
- `npm start` - starts server

# paths
## login
- POST `/register { email, password }` - `<userObj>`
- GET `/login { email, password }` - `<userObj>`

## lessons
- lesson management
  - POST `/lesson/new { name, date, rhythms, TutorId }` - `<lessonObj>`
  - PUT `/lesson/edit { lessonObj }` - `{ lesson: <lessonObj> }`
  - GET `/lesson/list?uid=` - `{ lessons: [<lessonObj>] }`
  - DELETE `/lesson/del?lid=` - `{ data: ok }`

## subscriptions
- POST `/subscribe/new { studentId, tutorId }` - `{ data: ok }`
- GET `/subscribe/get/student?uid=` - `{ tutors: [<userObj>] }`
- GET `/subscribe/get/tutor?uid=` - `{ students: [<userObj>] }`
