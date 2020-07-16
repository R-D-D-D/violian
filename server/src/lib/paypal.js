const config = require('../config/config')
const axios = require("axios")
const uniqid = require('uniqid')
const paypal = require('@paypal/checkout-server-sdk')
const PAYPAL_OAUTH_API = 'https://api.sandbox.paypal.com/v1/oauth2/token/'
const PAYPAL_ORDER_API = 'https://api.sandbox.paypal.com/v2/checkout/orders/'
const PAYPAL_OAUTH_API_LIVE = 'https://api.paypal.com/v1/oauth2/token/'
const PAYPAL_ORDER_API_LIVE = 'https://api.paypal.com/v2/checkout/orders/'

// /**
//  *
//  * Returns PayPal HTTP client instance with environment that has access
//  * credentials context. Use this instance to invoke PayPal APIs, provided the
//  * credentials have access.
//  */
// function client() {
//   return new paypal.core.PayPalHttpClient(environment());
// }

// /**
//  *
//  * Set up and return PayPal JavaScript SDK environment with PayPal access credentials.
//  * This sample uses SandboxEnvironment. In production, use LiveEnvironment.
//  *
//  */
// function environment() {
//   let clientId = process.env.PAYPAL_CLIENT_ID || 'PAYPAL-SANDBOX-CLIENT-ID'
//   let clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'PAYPAL-SANDBOX-CLIENT-SECRET'

//   return new checkoutNodeJssdk.core.SandboxEnvironment(
//     config.paypal.clientId, config.paypal.secret
//   )
// }

// async function prettyPrint(jsonData, pre=""){
//   let pretty = "";
//   function capitalize(string) {
//       return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
//   }
//   for (let key in jsonData){
//       if (jsonData.hasOwnProperty(key)){
//           if (isNaN(key))
//             pretty += pre + capitalize(key) + ": ";
//           else
//             pretty += pre + (parseInt(key) + 1) + ": ";
//           if (typeof jsonData[key] === "object"){
//               pretty += "\n";
//               pretty += await prettyPrint(jsonData[key], pre + "    ");
//           }
//           else {
//               pretty += jsonData[key] + "\n";
//           }

//       }
//   }
//   return pretty;
// }

module.exports = {
  async generatePaypalToken () {
    return axios({
      url: PAYPAL_OAUTH_API,
      // url: PAYPAL_OAUTH_API_LIVE,
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': "en_US"
      },
      auth: {
        username: config.paypal.clientId,
        password: config.paypal.secret
      },
      // auth: {
      //   username: config.paypalLive.clientId,
      //   password: config.paypalLive.secret
      // },
      params: {
        grant_type: 'client_credentials'
      }
    })
  },

  async generatePaypalPayout (accessToken, amount, courseId) {
    let batchCode = uniqid()
    return axios({
      url: 'https://api.sandbox.paypal.com/v1/payments/payouts',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      },
      data: {
        sender_batch_header: {
          sender_batch_id: batchCode,
          recipient_type: "EMAIL",
          email_subject: "Payment from Violian",
          email_message: "You received a payment. Thanks for using our service!"
        },

        items: [{
          amount: {
            value: `${amount}`,
            currency: "SGD"
          },
          sender_item_id: `${courseId}`,
          recipient_wallet: "PAYPAL",
          receiver: "sb-r88xc2607201@personal.example.com"
        }]
      }
    })
  },

  async generatePaypalClientToken (accessToken) {
    return axios({
      url: 'https://api.sandbox.paypal.com/v1/identity/generate-token',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': "en_US",
        'Authorization': `Bearer ${accessToken}`
      }
    })
  },

  async createOrder (accessToken, transactionAmount) {
    return axios({
      url: PAYPAL_ORDER_API,
      // url: PAYPAL_ORDER_API_LIVE,
      method: 'post',
      headers: {
        Accept:        `application/json`,
        Authorization: `Bearer ${ accessToken }`
      },
      data: {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'SGD',
            value: `${transactionAmount}`
          }
        }]
      }
    })
  },

  async captureOrder (accessToken, orderId) {
    return axios({
      url: PAYPAL_ORDER_API + orderId + '/capture',
      // url: PAYPAL_ORDER_API_LIVE + orderId + '/capture',
      method: 'post',
      headers: {
        'Content-Type':        `application/json`,
        Authorization: `Bearer ${ accessToken }`
      }
    })
  }
}