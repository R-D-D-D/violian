const config = require('../config/config')
const stripe = require('../lib/stripe');

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
}