import Api from '@/services/Api'

export default {
  getAllUsers () {
    return Api().get('user/list')
  },

  getAllStudents () {
    return Api().get('student/list')
  },

  getAllTutors () {
    return Api().get('tutor/list')
  }
}