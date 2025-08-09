import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ThemeProvider from './context/ThemeContext.jsx'
import ProductsProvider from './context/ProductsContext.jsx'
import AuthProvider from './context/AuthContext.jsx'
import { ToastContainer } from 'react-toastify';
import UserInfoProvider from './context/UserInfoContext.jsx'
import LocationProvider from './context/LocationContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserInfoProvider>
      <LocationProvider>
        <AuthProvider>
          <ProductsProvider>
            <ThemeProvider>
              <ToastContainer position="bottom-right" />
              <App />
            </ThemeProvider>
          </ProductsProvider>
        </AuthProvider>
      </LocationProvider>
    </UserInfoProvider>
  </StrictMode>
)