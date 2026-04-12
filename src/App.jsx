import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Catalog from './pages/Catalog'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<Catalog />} 
        />
        <Route 
          path="/product/:id" 
          element={<ProductDetails/>}
        />
        <Route 
          path="/cart" 
          element={<Cart/>}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
