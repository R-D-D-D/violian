import Api from '@/services/Api'

export default {
  create (threadInfo) {
    return Api().post('thread/new', threadInfo)
  },

  list (lessonId) {
    return Api().get(`thread/list?lid=${lessonId}`)
  },

  show (lid, uid) {
    return Api().get(`thread/show?lid=${lid}&uid=${uid}`)
  },

  delete (threadId) {
    return Api().delete(`thread/del?tid=${threadId}`)
  },

  getUnread (courseId, studentId) {
    return Api().get(`thread/unread?cid=${courseId}&uid=${studentId}`)
  }
}
