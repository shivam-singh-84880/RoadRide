import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Cars from './pages/Cars'
import CarDetails from './pages/CarDetails'
import MyBookings from './pages/MyBookings'
import Footer from './components/Footer'

const App = () => {
  const [showLogin, setShowLogin] = React.useState(false)
  const isOwnerPath = useLocation().pathname.startsWith('/owner')

  return (
    <>
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin} />}

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cars" element={<Cars />} />
      <Route path="/cars/:id" element={<CarDetails />} />
      <Route path="/my-bookings" element={<MyBookings />} />
    </Routes>

    {!isOwnerPath && <Footer />}

    </>
  )
}

export default App