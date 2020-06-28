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
    url: process.env.DB_URL || 'postgres://runding:wangrun123ding@127.0.0.1:5432/rhythmacademy'
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  }
}