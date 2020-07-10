import Api from '@/services/Api'

export default {
  create (postInfo) {
    return Api().post('post/new', postInfo)
  },

  list (threadId) {
    return Api().get(`post/list?tid=${threadId}`)
  },

  edit (postInfo) {
    return Api().put('post/edit', postInfo)
  },

  delete (postId) {
    return Api().delete(`post/del?pid=${postId}`)
  }
}
