import { useState, useEffect } from 'react'
import { AppProvider } from './Context/Context'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Home from './components/Home'
import AddProduct from './components/AddProduct'
import Product from './components/Product'
import Cart from './components/Cart'
import UpdateProduct from './components/UpdateProduct'
import Order from './components/Order'
import SearchResults from './components/SearchResults'
import LoginPage from './components/Login'
import SignupPage from './components/SignUp'
import ProtectedRoute from './auth/ProtectedRoute'
function App() {

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
  }
  const [selectedCategory, setSelectedCategory] = useState(null);


  return (
    <>
      <AppProvider>
      <BrowserRouter>
        <ToastContainer autoClose={2000}
          hideProgressBar={true} />
         <Navbar onSelectCategory={handleCategorySelect} />
        <div className="min-h-screen bg-gray-100">
          <Routes>
            
            <Route path="/add_product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
            <Route path="/product" element={<ProtectedRoute><Product /></ProtectedRoute>} />
            <Route path="product/:id" element={<ProtectedRoute><Product /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/product/update/:id" element={<ProtectedRoute><UpdateProduct /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Order /></ProtectedRoute>} />
            <Route path="/search-results" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
            <Route
              path="/"
              element={
                <ProtectedRoute><Home selectedCategory={selectedCategory} /></ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
    </>
  )
}

export default App
