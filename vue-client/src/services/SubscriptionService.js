import Api from '@/services/Api'

export default {
  subscribe (subscriptionInfo) {
    return Api().post('subscribe/new', subscriptionInfo)
  },

  getSubscriptionInfoOfStudent (userId) {
    return Api().get(`subscribe/get/student?uid=${userId}`)
  },

  getSubscriptionInfoOfTutor (userId) {
    return Api().get(`subscribe/get/tutor?uid=${userId}`)
  },

  getAllTutors () {
    return Api().get('tutor/list')
  }
}
