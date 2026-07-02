import axios from 'axios'

const api = axios.create({
    baseURL: 'http://127.0.0.1:3001/api',
})

let getTokenFn = null
export const setTokenGetter = (fn) => {
    getTokenFn = fn
}

api.interceptors.request.use(async (config) => {
    if (getTokenFn) {
        const token = await getTokenFn()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = '/auth'
        }
        return Promise.reject(error)
    }
)

export default api