import Api from '@/services/Api'

export default {
  create (exerciseInfo) {
    const instance = Api()
    instance.defaults.headers.post['Content-Type'] = 'multipart/form-data'
    return instance.post('exercise/new', exerciseInfo)
  },

  list (lessonId) {
    return Api().get(`exercise/list?lid=${lessonId}`)
  },

  edit (exerciseInfo) {
    const instance = Api()
    instance.defaults.headers.post['Content-Type'] = 'multipart/form-data'
    return instance.put('exercise/edit', exerciseInfo)
  },

  delete (exerciseId) {
    return Api().delete(`exercise/del?eid=${exerciseId}`)
  }
}
