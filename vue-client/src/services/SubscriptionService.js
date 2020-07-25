import Api from '@/services/Api'

export default {
  subscribe (subscriptionInfo) {
    return Api().post('subscribe/new', subscriptionInfo)
  },

  getSubscriptionInfoOfStudent (userId) {
    return Api().get(`subscribe/get/student?uid=${userId}`)
  },

  getSubscriptionInfoOfCourse (courseId) {
    return Api().get(`subscribe/get/course?cid=${courseId}`)
  },
}
