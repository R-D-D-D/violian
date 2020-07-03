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
  aws: {
    id: process.env.AWS_ACCESS_KEY,
    bucket: process.env.BUCKET_NAME,
    secret: process.env.AWS_SECRET_ACCESS_KEY
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  }
}
