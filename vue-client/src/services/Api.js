import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: process.env.NODE_ENV == 'production' ? '/api/' : 'http://localhost:8081/'
  })
}
