import Api from '@/services/Api'

export default {
  create (courseInfo) {
    return Api().post('course/new', courseInfo)
  },

  list (userId) {
    return Api().get(`course/list?uid=${userId}`)
  },

  listAll (value) {
    if (value) {
      return Api().get(`course/listall?search=${value}`)
    } else {
      return Api().get(`course/listall`)
    }
  },

  show (cid) {
    return Api().get(`course/show?cid=${cid}`)
  },

  edit (courseInfo) {
    return Api().put('course/edit', courseInfo)
  },

  delete (courseId) {
    return Api().delete(`course/del?cid=${courseId}`)
  }
}
