const braintree = require("braintree")
const config = require('../config/config')

const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: config.braintree.merchantId,
  publicKey: config.braintree.publicKey,
  privateKey: config.braintree.privateKey
})

module.exports = {
  generateClientToken (user) {
    return gateway.clientToken.generate({})
  },

  createTransaction (amount, nonce, deviceData) {
    return gateway.transaction.sale({
      amount: amount,
      paymentMethodNonce: nonce,
      deviceData: deviceData,
      options: {
        submitForSettlement: true
      }
    })
  },

  createPaypalTransaction (amount, nonce, deviceData) {
    var saleRequest = {
      amount: amount,
      paymentMethodNonce: nonce,
      deviceData: deviceData,
      orderId: "Mapped to PayPal Invoice Number",
      options: {
        submitForSettlement: true,
        paypal: {
          customField: "PayPal custom field",
          description: "Thank you for your purchase",
        },
      }
    };
    
    return gateway.transaction.sale(saleRequest)
  }
}
