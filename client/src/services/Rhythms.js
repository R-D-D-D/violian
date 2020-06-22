import Api from '@/services/Api'

export default {
  get (lesson_info) {
    return Api().get('lesson/', lesson_info)
  }
}
