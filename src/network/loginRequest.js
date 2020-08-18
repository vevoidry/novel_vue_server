import axios from 'axios'

export function loginRequest (config) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: 'http://localhost:9090',
      timeout: 5000
    })
    instance(config)
      .then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
  })
}
