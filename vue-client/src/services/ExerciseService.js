import Api from '@/services/Api'

export default {
  create (exerciseInfo) {
    return Api().post('exercise/new', exerciseInfo)
  },

  list (lessonId) {
    return Api().get(`exercise/list?lid=${lessonId}`)
  },

  edit (exerciseInfo) {
    return Api().put('exercise/edit', exerciseInfo)
  },

  delete (exerciseId) {
    return Api().delete(`lesson/delete?eid=${exerciseId}`)
  }
}
