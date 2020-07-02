import Api from '@/services/Api'

export default {
  create (courseInfo) {
    return Api().post('course/new', courseInfo)
  },

  list (userId) {
    return Api().get(`course/list?uid=${userId}`)
  },

  edit (courseInfo) {
    return Api().put('course/edit', courseInfo)
  },

  delete (courseId) {
    return Api().delete(`lesson/delete?cid=${courseId}`)
  }
}
