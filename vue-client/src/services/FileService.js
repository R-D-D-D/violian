import Api from '@/services/Api'

export default {
  list (lessonId) {
    return Api().get(`file/list?lid=${lessonId}`)
  },

  create (fileInfo) {
    return Api().post('file/new', fileInfo)
  },

  delete (fileId) {
    return Api().delete(`file/del?fid=${fileId}`)
  }
}
