import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Catalog from './pages/Catalog'
import ProductDetails from './pages/ProductDetails'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetails/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
