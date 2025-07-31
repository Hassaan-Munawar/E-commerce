const dev = process.env.DEV 
const prod = process.env.PROD

const BASE_URL = prod

export const AppRoutes = {
    login: BASE_URL+"user",
    products: BASE_URL+"products",
}