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

  isSubscribed (courseId) {
    return Api().get(`subscribe/get/is-subscribed?cid=${courseId}`)
  },

  isOwned (courseId) {
    return Api().get(`subscribe/get/is-owned?cid=${courseId}`)
  }
}
