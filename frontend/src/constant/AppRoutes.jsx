const dev = import.meta.env.VITE_DEV;
const prod = import.meta.env.VITE_PROD;


const BASE_URL = prod

export const AppRoutes = {
    login: BASE_URL+"user",
    products: BASE_URL+"products",
    editUser: BASE_URL+"user"
}