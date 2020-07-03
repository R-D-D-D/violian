import Api from '@/services/Api'

export default {
  create (exerciseInfo) {
    return Api().post('exercise/new', exerciseInfo, {
      headers: {'Content-Type': 'multipart/form-data' }
    })
  },

  list (lessonId) {
    return Api().get(`exercise/list?lid=${lessonId}`)
  },

  edit (exerciseInfo) {
    return Api().put('exercise/edit', exerciseInfo)
  },

  delete (exerciseId) {
    return Api().delete(`exercise/delete?eid=${exerciseId}`)
  }
}
