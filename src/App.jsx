import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Catalog from './pages/Catalog'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalog />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
