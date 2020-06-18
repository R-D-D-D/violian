import Api from '@/services/Api'

export default {
  index (credentials) {
    return Api().post('register', credentials)
  },

  get (credentials) {
    return Api().post('login', credentials)
  }
}
