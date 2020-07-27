import Api from '@/services/Api'

export default {
  register (credentials) {
    return Api().post('register', credentials)
  },

  login (credentials) {
    return Api().post('login', credentials)
  },

  adminLogin (credentials) {
    return Api().post('admin-login', credentials)
  }
}
