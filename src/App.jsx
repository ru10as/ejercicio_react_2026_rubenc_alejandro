import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import AvisoLegal from './pages/AvisoLegal'
import Contacto from './pages/Contacto'
import ErrorPage from './pages/ErrorPage'
import Favoritos from './pages/Favoritos'
import Home from './pages/Home'
import Login from './components/login/Login'
import Registro from './components/login/Registro'
import DetallePelicula from './components/peliculas/DetallePelicula'
import Footer from './components/ui/Footer'
import Header from './components/ui/Header'

function App() {

  return (
    <>
      <div className='d-flex flex-column min-vh-100'>
        <Header />
          <div className='flex-grow-1'>
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/favoritos" element={<Favoritos />}/>
              <Route path="/avisolegal" element={<AvisoLegal />}/>
              <Route path="/contacto" element={<Contacto />}/>
              <Route path="/home" element={<Home />}/>
              <Route path="/errorpage" element={<ErrorPage />}/>
            </Routes>
          </div>
      <Footer />
      </div>
      
    </>
  )
}

export default App
