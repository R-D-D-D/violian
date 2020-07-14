const stripe = require('../lib/stripe');
const braintree = require('../lib/braintree')


module.exports = {
  async createPaymentIntent (req, res) {
    try {
      const paymentIntent = await stripe.createPaymentIntent()
      res.json({
        clientSecret: paymentIntent.client_secret
      })
    } catch (err) {
      res.status(500).send({
        error: 'an  error has occured trying to create payment intent'
      })
    }
  },

  async createClientToken (req, res) {
    try {
      const response = await braintree.generateClientToken(req.user)
      res.json({
        clientToken: response.clientToken
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to create client token'
      })
    }
  },

  async createTransaction (req, res) {
    try {
      const {amount, nonce, deviceData} = req.body
      const result = await braintree.createTransaction(amount, nonce, deviceData)
      console.log(result)
      res.json({
        result: result
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to create transaction'
      })
    }
  },

  async createPaypalTransaction (req, res) {
    try {
      const {amount, nonce, deviceData} = req.body
      const result = await braintree.createPaypalTransaction(amount, nonce, deviceData)
      console.log(result)
      res.json({
        result: result
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to create transaction'
      })
    }
  }
}