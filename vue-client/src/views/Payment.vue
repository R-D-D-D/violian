<template lang="pug">
  div(v-if="course")
    v-container
      v-row.justify-center
        v-col(cols="12" md="6")
          v-row.justify-center
            v-col.px-4
              h2.font-weight-bold Checkout
          
          v-radio-group(v-model="paymentMethod" :mandatory="true")
            v-radio(label="Paypal" value="paypal")
            v-radio(label="Credit Card" value="credit card")

          v-row.justify-center(:class="{ hide: paymentMethod == 'paypal' }")
            v-col.px-4
              #dropin-container

          v-row
            v-col
              v-card.pa-3.px-10(outlined)
                v-row.px-3
                  v-col
                    h2.font-weight-bold Summary
                v-row.px-3
                  v-col(cols="12").px-4
                    p.alignleft {{ course.name }}:
                    p.alignright S$ {{ course.price }}
                  v-col(cols="12").px-4
                    p.alignleft GST:
                    p.alignright S$ {{ (course.price * 0.07).toFixed(2) }}
                    div(style="clear: both;")
                v-divider.px-3
                v-row.px-3
                  v-col
                    p.alignleft.font-weight-bold Total:
                    p.alignright.font-weight-bold S$ {{ (course.price + (course.price * 0.07)).toFixed(2) }}
                    div(style="clear: both;")
                v-btn.mb-5(large color="#ec5252" dark @click="requestPaymentMethod" style="width: 50%;" :class="{ hide: paymentMethod == 'paypal' }") Complete Payment
  
                //- v-row.justify-center(:class="{ hide: paymentMethod != 'paypal' }")
                //-   v-col.px-4
                //-     div(id="paypal-button")

                v-row.justify-center(:class="{ hide: paymentMethod != 'paypal' }")
                  v-col
                    div#paypal-button-container

                div.error(v-model="error") {{ error }}
</template>

<script>
import PaymentService from '@/services/PaymentService'
import ThreadService from '@/services/ThreadService'
import CourseService from '@/services/CourseService'

export default {
  name: 'Payment',
  data () {
    return {
      course: null,
      clientToken: '',
      dropinInstance: null,
      nonceObj: null,
      deviceData: null,
      transaction: null,
      error: null,
      paymentMethod: 'paypal'
    }
  },

  methods: {
    togglePaymentMethod () {
      if (this.paymentMethod == 'paypal') {
        this.paymentMethod = 'credit card'
      } else {
        this.paymentMethod = 'paypal'
      }
    },

    async requestPaymentMethod () {
      this.nonceObj = await this.dropinInstance.requestPaymentMethod()
      this.transaction = (await PaymentService.createTransaction({
        amount: this.course.price,
        nonce: this.nonceObj.nonce,
        deviceData: this.deviceData
      })).data.result
      if (this.transaction.success) {
        this.subscribe()
      } else {
        this.error = this.transaction.message
      }
    },

    async subscribe () {
      await Promise.all(this.course.lessons.map(async lesson => {
        var response = await ThreadService.create({
          lid: lesson.id
        })
        response.data.thread.posts = []
        lesson.thread = response.data.thread
        return lesson
      }))

      await this.$store.dispatch('subscribe', {
        studentId: this.$store.state.user.id,
        courseId: this.course.id
      })

      this.$router.push(`/course/show/${this.course.id}`)
    }
  },

  mounted: async function () {
    var response = await CourseService.show(this.$route.params.course_id)
    this.course = response.data.course

    const clientToken = (await PaymentService.getClientToken()).data.clientToken
    this.clientToken = clientToken

    const dropinInstance = await window.braintree.dropin.create({
      authorization: clientToken,
      container: '#dropin-container'
    })

    this.dropinInstance = dropinInstance

    const clientInstance = await window.braintree.client.create({
      authorization: clientToken
    })

    const dataCollectorInstance = await window.braintree.dataCollector.create({
      client: clientInstance,
      paypal: true
    })

    this.deviceData = dataCollectorInstance.deviceData

    // paypal braintree
    // Create a client.
    // const paypalCheckoutInstance = await window.braintree.paypalCheckout.create({
    //     client: clientInstance
    // })
    
    // const paypalButton = await window.paypal.Button.render({
    //   env: 'sandbox', // or 'production'

    //   payment: async () => {
    //     return await paypalCheckoutInstance.createPayment({
    //       // Your PayPal options here. For available options, see
    //       // http://braintree.github.io/braintree-web/current/PayPalCheckout.html#createPayment
    //       flow: 'checkout',
    //       amount: this.course.price,
    //       currency: 'SGD',
    //       intent: 'capture'
    //     })
    //   },

    //   onAuthorize: async (data) => {
    //     const response =  await paypalCheckoutInstance.tokenizePayment(data)
    //     this.transaction = (await PaymentService.createPaypalTransaction({
    //       amount: this.course.price,
    //       nonce: response.nonce,
    //       deviceData: this.deviceData
    //     })).data.result
    //     if (this.transaction.success) {
    //       this.subscribe()
    //     } else {
    //       this.error = this.transaction.message
    //     }
    //   },

    //   onCancel: function (data) {
    //     console.log('checkout.js payment cancelled', JSON.stringify(data, 0, 2))
    //   },

    //   onError: function (err) {
    //     console.error('checkout.js error', err)
    //   }
    // }, '#paypal-button')

    // console.log(paypalButton)

    // pure paypal api
    let paypalScript = document.createElement('script')
    paypalScript.src = 'https://www.paypal.com/sdk/js?client-id=AepgsiQK_rhw-m-bTjjuZ5lRxPWadsmSzn9dH_Lsn8o5uzSsTHsIRuxfaCfyg0odhrZFxq6_qpsmu-P7&currency=SGD'
    paypalScript.addEventListener('load', () => {
      
      window.paypal.Buttons({
        locale: 'en_US',

        createOrder: async () => {
          const orderId = (await PaymentService.createOrder({
            amount: (this.course.price + (this.course.price * 0.07)).toFixed(2)
          })).data.order.id
          this.orderId = orderId
          return orderId
        },
        onApprove: async () => {
          const result = (await PaymentService.captureOrder({
            orderId: this.orderId
          })).data.result
          this.result = result
          if (this.result.status == "COMPLETED") {
            alert('Success!')
            this.subscribe()
          }
        },
        onError: err => {
          console.log(err)
        }
      }).render('#paypal-button-container');

      let connectScript = document.createElement('script')  
      connectScript.src = 'https://www.paypalobjects.com/js/external/connect/api.js'
      connectScript.addEventListener("load", () => {
        window.paypal.use(['login'], function (login) {
          login.render ({
            "appid":"AepgsiQK_rhw-m-bTjjuZ5lRxPWadsmSzn9dH_Lsn8o5uzSsTHsIRuxfaCfyg0odhrZFxq6_qpsmu-P7",
            "authend":"sandbox",
            "scopes":"openid",
            "containerid":"connect-button",
            "responseType":"code",
            "locale":"en-us",
            "buttonShape":"rectangle",
            "buttonSize":"lg",
            "returnurl":"https://example.com"
          })
        })
      })
      document.body.appendChild(connectScript)
    })
    document.body.appendChild(paypalScript)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.alignleft {
  float: left;
}

.alignright {
  float: right;
}

p {
  margin: 0 !important;
  font-size: 18px;
}

.hide {
  display: none;
}

.error {
  color: white;
}
</style>
