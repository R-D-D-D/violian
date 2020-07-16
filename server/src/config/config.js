module.exports = {
  port: process.env.PORT || 8081,
  // db: {
  //   database: process.env.DB_NAME || 'rhythmacademy',
  //   user: process.env.DB_USER || 'rhythmacademy',
  //   password: process.env.DB_PASS || 'rhythmacademy',
  //   options: {
  //     dialect: process.env.DIALECT || 'sqlite',
  //     host: process.env.HOST || 'local',
  //     storage: './rhythmacademy.sqlite'
  //   }
  // },
  db: {
    url: process.env.DB_URL || './rhythmacademy.sqlite',
    dialect: process.env.DB_DIALECT || 'sqlite'
  },
  mailgun: {
    apiKey: process.env.MG_API_KEY,
    domain: process.env.MG_DOMAIN
  },
  aws: {
    id: process.env.AWS_ACCESS_KEY,
    bucket: process.env.BUCKET_NAME,
    secret: process.env.AWS_SECRET_ACCESS_KEY
  },
  stripe: {
    publicKey: process.env.STRIPE_PUBLIC_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY
  },
  braintree: {
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
  },
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID,
    secret: process.env.PAYPAL_SECRET
  },
  paypalLive: {
    clientId: process.env.LIVE_PAYPAL_CLIENT_ID,
    secret: process.env.LIVE_PAYPAL_SECRET
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  }
}
