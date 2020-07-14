import Api from '@/services/Api'

export default {
  getClientToken () {
    return Api().get('client-token')
  },

  createTransaction (paymentInfo) {
    return Api().post('checkout', paymentInfo)
  },

  createPaypalTransaction (paymentInfo) {
    return Api().post('paypal-checkout', paymentInfo)
  }
}
