<template lang="pug">
  v-container
    //- div(ref='paypal')
    v-row.justify-center
      v-col(cols=6)
        div#paypal-button-container

        div#or  or 
    // Advanced credit and debit card payments form
    v-row
      v-col
        .card_container
          form#my-sample-form(v-if="isEligible")
            label(for='card-number') Card Number
            #card-number.card_field
            div
              label(for='expiration-date') Expiration Date
              #expiration-date.card_field
            div
              label(for='cvv') CVV
              #cvv.card_field
            label(for='card-holder-name') Name on Card
            input#card-holder-name(type='text' name='card-holder-name' autocomplete='off' placeholder='card holder name')
            div
              label(for='card-billing-address-street') Billing Address
              input#card-billing-address-street(type='text' name='card-billing-address-street' autocomplete='off' placeholder='street address')
            div
              label(for='card-billing-address-unit') &nbsp;
              input#card-billing-address-unit(type='text' name='card-billing-address-unit' autocomplete='off' placeholder='unit')
            div
              input#card-billing-address-city(type='text' name='card-billing-address-city' autocomplete='off' placeholder='city')
            div
              input#card-billing-address-state(type='text' name='card-billing-address-state' autocomplete='off' placeholder='state')
            div
              input#card-billing-address-zip(type='text' name='card-billing-address-zip' autocomplete='off' placeholder='zip / postal code')
            div
              input#card-billing-address-country(type='text' name='card-billing-address-country' autocomplete='off' placeholder='country code')
            br
            br
            button#submit.btn(value='submit') Pay

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
    setLoaded () {
      this.loaded = true;
      window.paypal.Buttons({
        createOrder: async () => {
          const orderId = (await PaymentService.createOrder({
            amount: this.course.price
          })).data.order.id
          this.orderId = orderId
          return orderId
        },
        onApprove: async () => {
          const result = (await PaymentService.captureOrder({
            orderId: this.orderId
          })).data.result
          this.result = result
        },
        onError: err => {
          console.log(err)
        }
      })
      .render('#paypal-button-container');

      // if (window.paypal.HostedFields.isEligible()) {
      //   window.paypal.HostedFields.render({
      //     createOrder: async () => {
      //       const orderId = (await PaymentService.createOrder(this.course.price)).data.order.id
      //       this.orderId = orderId
      //     }, // replace order-ID with the order ID
      //     styles: {
      //       'input': {
      //         'font-size': '17px',
      //         'font-family': 'helvetica, tahoma, calibri, sans-serif',
      //         'color': '#3a3a3a'
      //       },
      //       ':focus': {
      //         'color': 'black'
      //       }
      //     },
      //     fields: {
      //       number: {
      //         selector: '#card-number',
      //         placeholder: 'card number'
      //       },
      //       cvv: {
      //         selector: '#cvv',
      //         placeholder: 'card security number'
      //       },
      //       expirationDate: {
      //         selector: '#expiration-date',
      //         placeholder: 'mm/yy'
      //       }
      //     }
      //   }).then(function (hf) {
      //     console.log(hf)
      //     document.getElementById('my-sample-form').addEventListener('submit', function (event) {
      //       event.preventDefault();
      //       hf.submit({
      //         // Cardholder Name
      //         cardholderName: document.getElementById('card-holder-name').value,
      //         // Billing Address
      //         billingAddress: {
      //           streetAddress: document.getElementById('card-billing-address-street').value,      // address_line_1 - street
      //           extendedAddress: document.getElementById('card-billing-address-unit').value,       // address_line_2 - unit
      //           region: document.getElementById('card-billing-address-state').value,           // admin_area_1 - state
      //           locality: document.getElementById('card-billing-address-city').value,          // admin_area_2 - town / city
      //           postalCode: document.getElementById('card-billing-address-zip').value,           // postal_code - postal_code
      //           countryCodeAlpha2: document.getElementById('card-billing-address-country').value   // country_code - country
      //         }
      //       })
      //     })
      //   })
      // }
      // else {
      //   this.isEligible = false // hides the advanced credit and debit card payments fields if merchant isn't eligible
      // }
    }
  },

  mounted: async function () {
    // const clientToken = (await PaymentService.getPaypalClientToken()).data.token

    // const script = document.createElement("script");
    // console.log(clientToken)
    // script.setAttribute("data-client-token", clientToken)
    // script.src = `https://www.paypal.com/sdk/js?client-id=AepgsiQK_rhw-m-bTjjuZ5lRxPWadsmSzn9dH_Lsn8o5uzSsTHsIRuxfaCfyg0odhrZFxq6_qpsmu-P7&currency=SGD`;
    // script.addEventListener("load", this.setLoaded);
    // document.body.appendChild(script);
    window.paypal.Buttons({
      createOrder: async () => {
        const orderId = (await PaymentService.createOrder({
          amount: this.course.price
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
        }
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
#or {
    position: relative;
    z-index: 1;
    overflow: hidden;
    text-align: center;
}

#or:before, #or:after {
    position: absolute;
    top: 51%;
    overflow: hidden;
    height: 1px;
    content: '\a0';
    background-color: gray;
    width: 47%;
}

#or:before {
  width: 47%;
  left: 0;
}

#or:after {
  width: 47%;
  right: 0;
}

.paypal-button-container {
    border-radius: 5px;
    background-color: #FFFFFF;
    padding: 20px;
    max-width: 760px;
    width: 100%;
    margin: 0 auto;
}
.card_container {
    border-radius: 5px;
    background-color: #FFFFFF;
    padding: 20px;
    max-width: 760px;
    width: 100%;
    margin: 0 auto;
}
.card_field{
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-top: 6px;
    margin-bottom: 16px;
    resize: vertical;
    height:40px;
    background:white;
    font-size:17px;
    color:#3a3a3a;
    font-family:helvetica, tahoma, calibri, sans-serif;
}
.card_field_50{
    width: 50%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-top: 6px;
    margin-bottom: 16px;
    resize: vertical;
    height:40px;
    background:white;
    font-size:17px;
    color:#3a3a3a;
    font-family:helvetica, tahoma, calibri, sans-serif;
}
.card_field_75{
    width: 75%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-top: 6px;
    margin-bottom: 16px;
    resize: vertical;
    height:40px;
    background:white;
    font-size:17px;
    color:#3a3a3a;
    font-family:helvetica, tahoma, calibri, sans-serif;
}
.row {
    display: -ms-flexbox; /* IE10 */
    display: flex;
    -ms-flex-wrap: wrap; /* IE10 */
    flex-wrap: wrap;
    margin: 0 -16px;
}
.col-25 {
    -ms-flex: 25%; /* IE10 */
    flex: 25%;
}
.col-50 {
    -ms-flex: 50%; /* IE10 */
    flex: 50%;
}
input[type=text], select, textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-top: 6px;
    margin-bottom: 16px;
    resize: vertical;
    height:40px;
    background:white;
    font-size:17px;
    color:#3a3a3a;
    font-family:helvetica, tahoma, calibri, sans-serif;
}
input[type=submit] {
    background-color: #4CAF50;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
.message_container {
    border-radius: 5px;
    background:#FFFFFF;
    font-size:13px;
    font-family:monospace;
    padding: 20px;
}
#loading {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: fixed;
    display: block;
    opacity: 0.7;
    background-color: #fff;
    z-index: 99;
    text-align: center;
}
#loading-image {
    position: absolute;
    z-index: 15;
    top: 50%;
    left: 50%;
    margin: -100px 0 0 -150px;
}
.spinner {
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -50px; /* half width of the spinner gif */
    margin-top: -50px; /* half height of the spinner gif */
    text-align:center;
    z-index:1234;
    overflow: auto;
    width: 100px; /* width of the spinner gif */
    height: 102px; /* height of the spinner gif +2px to fix IE8 issue */
}
.button_container {
    display: flex;
    justify-content: center;
}
button:hover {
    background-color: powderblue;
}
button {
    width:229px;
    height:49px;
    background:lightblue;
    border:1px dotted black;
    font-size:17px;
    color:#3a3a3a;
    padding: 12px 20px;
    border-radius: 4px;
    cursor: pointer;
    margin: 0 auto;
}
.btn_small{
    width:130px;
    height:39px;
    background:lightblue;
    border:1px dotted black;
    font-size:14px;
    color:#3a3a3a;
}
.btn_small:hover {
    background-color: powderblue;
}
</style>
