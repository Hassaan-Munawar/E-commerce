import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import PageNotFound from './pages/PageNotFound';
import Cart from './pages/Cart';
import Loading from './components/Loading/Loading';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

function App() {
  const { user, loading } = useContext(AuthContext);

  const PrivateRoute = ({ children }) => {
    const location = useLocation();

    if (loading) return <Loading />

    if (!user) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
  };

  const PublicRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    if (user) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
  };

  return (
    <BrowserRouter>
    <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Public Route */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />


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
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
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
