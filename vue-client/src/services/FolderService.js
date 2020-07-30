import Api from '@/services/Api'

export default {
  show (folderId) {
    return Api().get(`folder/show?fid=${folderId}`)
  },

  list (lessonId) {
    return Api().get(`folder/list?lid=${lessonId}`)
  },

  create (folderInfo) {
    return Api().post('folder/new', folderInfo)
  },

  delete (folderId) {
    return Api().delete(`folder/del?fid=${folderId}`)
  }
}
