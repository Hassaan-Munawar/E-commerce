import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ThemeProvider from './context/ThemeContext.jsx'
import ProductsProvider from './context/ProductsContext.jsx'
import AuthProvider from './context/AuthContext.jsx'
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProductsProvider>
        <ThemeProvider>
          <ToastContainer />
          <App />
        </ThemeProvider>
      </ProductsProvider>
    </AuthProvider>
  </StrictMode>,
)
