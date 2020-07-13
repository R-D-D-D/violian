const config = require('../config/config')

const stripe = require('stripe')(config.stripe.secretKey);

module.exports = {
  async createPaymentIntent () {
    const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'sgd',
    // Verify your integration in this guide by including this parameter
    metadata: {integration_check: 'accept_a_payment'},
    });
    return paymentIntent
  }
}