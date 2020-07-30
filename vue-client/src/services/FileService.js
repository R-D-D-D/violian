import Api from '@/services/Api'

export default {
  create (fileInfo) {
    return Api().post('file/new', fileInfo)
  },

  delete (fileId) {
    return Api().delete(`file/del?fid=${fileId}`)
  }
}
