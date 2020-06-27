import Api from '@/services/Api'

export default {
  create (lessonInfo) {
    return Api().post('lesson/new', lessonInfo)
  },

  list (userId) {
    return Api().get(`lesson/list?uid=${userId}`)
  },

  edit (lessonInfo) {
    return Api().put('lesson/edit', lessonInfo)
  }
}
