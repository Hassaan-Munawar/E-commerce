import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import PageNotFound from './pages/PageNotFound';

function App() {
  const { user, loading } = useContext(AuthContext);

  // Helper to protect private routes
  const PrivateRoute = ({ children }) => {
    const location = useLocation();

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    if (!user) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Public Route */}
        <Route path="/auth" element={<Auth />} />

        {/* Protected Routes */}
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <PrivateRoute>
              <ProductDetail />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
