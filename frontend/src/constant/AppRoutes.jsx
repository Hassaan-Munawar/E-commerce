const dev = 'http://localhost:5001/'
const prod = 'https://h-e-commerce-backend.vercel.app/'

const BASE_URL = dev

export const AppRoutes = {
    login: BASE_URL+"user",
    products: BASE_URL+"products",
}