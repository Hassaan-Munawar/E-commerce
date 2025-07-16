import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Products from './pages/Products';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import PageNotFound from './pages/PageNotFound';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<Products />} />
          <Route path='/products/:id' element={<ProductDetail />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;