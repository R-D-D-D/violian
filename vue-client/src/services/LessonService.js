import Api from '@/services/Api'

export default {
  show (lessonId) {
    return Api().get(`lesson/show?lid=${lessonId}`)
  },

  create (lessonInfo) {
    return Api().post('lesson/new', lessonInfo)
  },

  list (courseId) {
    return Api().get(`lesson/list?cid=${courseId}`)
  },

  edit (lessonInfo) {
    return Api().put('lesson/edit', lessonInfo)
  },

  delete (lessonId) {
    return Api().delete(`lesson/del?lid=${lessonId}`)
  }
}
