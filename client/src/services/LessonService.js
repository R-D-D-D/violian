import Api from '@/services/Api'

export default {
  create (lesson_info) {
    return Api().post('lesson/new', lesson_info)
  }
}
