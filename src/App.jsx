import React from 'react'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Visionsection from './sections/Visionsection'
import Footer from './components/Footer'

const App = () => {
  return (
    <div>
      <div className='h-screen bg-cover bg-center relative' style={{backgroundImage: 'url(/assets/myanmar_tm5_2004349_lrg.jpg)', backgroundPosition: 'center bottom'}}>
        <Navbar />
        <Hero />
      </div>
      <div className='relative'>
        <div className='absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0B593E] to-transparent pointer-events-none z-10'></div>
        <Visionsection />
      </div>
      <Footer />
    </div>
  )
}

export default App
