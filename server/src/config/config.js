module.exports = {
  port: process.env.PORT || 8081,
  db: {
    database: process.env.DB_NAME || 'rhythmacademy',
    user: process.env.DB_USER || 'rhythmacademy',
    password: process.env.DB_PASS || 'rhythmacademy',
    options: {
      dialect: process.env.DIALECT || 'sqlite',
      host: process.env.HOST || 'local',
      storage: './rhythmacademy.sqlite'
    }
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  }
}