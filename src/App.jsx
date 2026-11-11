import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Catalog from './pages/Catalog'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import { initAuth } from './services/authService'

function App() {
  // Validate the stored token once and refresh the user info.
  useEffect(() => {
    initAuth();
  }, [])

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
        <Route 
          path="/login" 
          element={<Login/>}
        />
        <Route 
          path="/register" 
          element={<Register/>}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
