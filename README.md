# getting started
- `npm start` - starts server

# paths
## login
- POST `/register { email, password }` - `<userObj>`
- GET `/login { email, password }` - `<userObj>`

## lessons
- lesson management
  - POST `/lesson/new? { name, date, rhythms, tutorId}` - `<lessonObj>`
  - GET `/lesson/list { tutorId }` - `{ lessons: [<lessonObj>] }`
  - GET `/lesson/del { lessonId }` - `{ data: ok }`

## subscriptions
- POST `/subscribe/new { studentId, tutorId }` - `{ data: ok }`
- GET `/subscribe/get/student { studentId }` - `{ tutors: [<userObj>] }`
- GET `/subscribe/get/tutor { tutor Id }` - `{ students: [<userObj>] }`
