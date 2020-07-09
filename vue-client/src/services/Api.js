import axios from 'axios'
import store from '@/store/store'

export default () => {
  return axios.create({
    baseURL: process.env.NODE_ENV == 'production' ? '/api/' : 'http://localhost:8081/',
    headers: {
      Authorization: `Bearer ${store.state.token}`
    }
  })
}
