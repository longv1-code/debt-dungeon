import api from './index.js'

export const createCheckoutSession = async () => {
    const response = await api.post('/stripe/checkout')
    return response.data
}