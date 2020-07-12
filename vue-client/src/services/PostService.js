import Api from '@/services/Api'

export default {
  create (postInfo) {
    const instance = Api()
    instance.defaults.headers.post['Content-Type'] = 'multipart/form-data'
    return instance.post('post/new', postInfo)
  },

  list (threadId) {
    return Api().get(`post/list?tid=${threadId}`)
  },

  edit (postInfo) {
    const instance = Api()
    instance.defaults.headers.post['Content-Type'] = 'multipart/form-data'
    return instance.post('post/edit', postInfo)
  },

  delete (postId) {
    return Api().delete(`post/del?pid=${postId}`)
  }
}
