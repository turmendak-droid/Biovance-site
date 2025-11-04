import React from 'react'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Visionsection from './sections/Visionsection'

const App = () => {
  return (
    <div>
      <div className='h-screen bg-cover bg-center relative' style={{backgroundImage: 'url(/src/assets/myanmar_tm5_2004349_lrg.jpg)', backgroundPosition: 'center bottom'}}>
        <Navbar />
        <Hero />
      </div>
      <Visionsection />
    </div>
  )
}

export default App
