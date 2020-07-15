import Api from '@/services/Api'

export default {
  // braintree
  getClientToken () {
    return Api().get('braintree-client-token')
  },

  createTransaction (paymentInfo) {
    return Api().post('braintree-checkout', paymentInfo)
  },

  createPaypalTransaction (paymentInfo) {
    return Api().post('braintree-paypal-checkout', paymentInfo)
  },

  // paypal direct
  getPaypalClientToken () {
    return Api().get('paypal-client-token')
  },

  createOrder (paymentInfo) {
    return Api().post('paypal-create-order', paymentInfo)
  },

  captureOrder (paymentInfo) {
    return Api().post('paypal-capture-order', paymentInfo)
  }
}
