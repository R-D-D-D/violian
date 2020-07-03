import Api from '@/services/Api'

export default {
  create (lessonInfo) {
    // const instance = axios.create({
    //   baseURL: process.env.NODE_ENV == 'production' ? '/api/' : 'http://localhost:8081/',
    //   headers: {'Content-Type': 'multipart/form-data' }
    // });
    // axios.post('https://example.com', form, { headers: form.getHeaders() })
    // return Api().post('lesson/new', lessonInfo, {
    //   headers: {'Content-Type': 'multipart/form-data' }
    // })
    return Api().post('lesson/new', lessonInfo)
  },

  list (courseId) {
    return Api().get(`lesson/list?cid=${courseId}`)
  },

  edit (lessonInfo) {
    return Api().put('lesson/edit', lessonInfo)
  },

  delete (lessonId) {
    return Api().delete(`lesson/delete?lid=${lessonId}`)
  }
}
