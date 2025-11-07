import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Visionsection from './sections/Visionsection'
import Footer from './components/Footer'
import AboutUs from './sections/AboutUs'
import Updates from './pages/Updates'
import BlogDetail from './pages/BlogDetail'
import FloatingCard from './components/FloatingCard'
import Waitlist from './pages/Waitlist'
import Admin from './pages/Admin'

const Home = () => (
  <div>
    <div className='h-screen bg-cover bg-center relative' style={{backgroundImage: 'url(/assets/myanmar_tm5_2004349_lrg.jpg)', backgroundPosition: 'center bottom'}}>
      <Navbar />
      <Hero />
    </div>
    <div className='relative mt-16 md:mt-20'>
      <div className='absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0B593E] to-transparent pointer-events-none z-10'></div>
      <Visionsection />
    </div>
    <AboutUs />
    <Footer />
    <FloatingCard />
  </div>
)

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/updates" element={<Updates />} />
      <Route path="/blogs/:id" element={<BlogDetail />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/waitlist" element={<Waitlist />} />
    </Routes>
  )
}

export default App
