import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Cars from './pages/Cars'
import CarDetails from './pages/CarDetails'
import MyBookings from './pages/MyBookings'
import Footer from './components/Footer'
import ManageCars from './pages/owner/ManageCars'
import ManageBookings from './pages/owner/ManageBookings'
import AddCar from './pages/owner/AddCar'
import Dashboard from './pages/owner/Dashboard'
import Layout from './pages/owner/Layout'

const App = () => {
  const [showLogin, setShowLogin] = React.useState(false)
  const isOwnerPath = useLocation().pathname.startsWith('/owner')

  return (
    <>
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin} />}

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cars" element={<Cars />} />
      <Route path="/car-details/:id" element={<CarDetails />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/owner" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="add-car" element={<AddCar />} />
        <Route path="manage-cars" element={<ManageCars />} />
        <Route path="manage-bookings" element={<ManageBookings />} />
      </Route>
    </Routes>

    {!isOwnerPath && <Footer />}

    </>
  )
}

export default App