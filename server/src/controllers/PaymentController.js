const braintree = require('../lib/braintree')
const paypal = require('../lib/paypal')
const { generatePaypalPayout } = require('../lib/paypal')

module.exports = {

  // braintree
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
  },

  // paypal direct
  async generatePaypalToken (req, res) {
    try {
      const token = (await paypal.generatePaypalToken()).data.access_token
      res.json({
        token: token
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to get paypal access token'
      })
    }
  },

  async generatePaypalPayout (req, res) {
    try {
      const {accessToken, amount, courseId} = req.body
      const response = (await paypal.generatePaypalPayout(accessToken, amount, courseId))
      res.json({
        result: response.data
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to make payout'
      })
    }
  },

  async generatePaypalClientToken (req, res) {
    try {
      const tokenObj = (await paypal.generatePaypalToken()).data
      const response = (await paypal.generatePaypalClientToken(tokenObj.access_token))
      res.json({
        token: response.data.client_token
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to make payout'
      })
    }
  },

  async createOrder (req, res) {
    try {
      const {amount} = req.body
      const tokenObj = (await paypal.generatePaypalToken()).data
      const response = (await paypal.createOrder(tokenObj.access_token, amount))
      res.json({
        order: response.data
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to create order'
      })
    }
  },

  async captureOrder (req, res) {
    try {
      const {orderId} = req.body
      const tokenObj = (await paypal.generatePaypalToken()).data
      const response = (await paypal.captureOrder(tokenObj.access_token, orderId))
      res.json({
        result: response.data
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to capture order'
      })
    }
  }
}