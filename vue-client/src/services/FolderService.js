import Api from '@/services/Api'

export default {
  show (lessonId) {
    return Api().get(`folder/show?lid=${lessonId}`)
  },

  create (folderInfo) {
    return Api().post('folder/new', folderInfo)
  },

  delete (folderId) {
    return Api().delete(`folder/del?fid=${folderId}`)
  }
}
