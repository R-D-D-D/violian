<template lang="pug">
  v-container
    //- div(ref='paypal')
    v-row.justify-center
      v-col(cols=6)
        div#paypal-button-container

</template>

<script>
import PaymentService from '@/services/PaymentService'

export default {
  name: 'AdvancedPayment',
  data () {
    return {
      loaded: false,
      paidFor: false,
      course: {
        price: 17.77,
        description: "leg lamp from that one movie"
      },
      isEligible: true,
      orderId: '',
      result: null
    }
  },

  methods: {
  },

  mounted: async function () {
    window.paypal.Buttons({
      createOrder: async (data, actions) => {
        console.log(data)
        console.log(actions)
        const orderId = (await PaymentService.createOrder(this.course.price)).data.order.id
        this.orderId = orderId
      },
      onApprove: async (data, actions) => {
        console.log(data)
        console.log(actions)
        const result = (await PaymentService.captureOrder(this.orderId)).data.result
        this.result = result
      },
      onError: err => {
        console.log(err)
      }
    })
    .render('#paypal-button-container');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
