import React from 'react'

const Navbar = () => {
  return (
    <div className='h-16 w-full bg-black/30 backdrop-blur-sm relative z-30'>
      <ul className='flex justify-between items-center ml-6 mr-6'>
        <li className='mt-3 text-xl text-white navbar-btn active hover-green'>Home</li>
        <h1 className='mt-7 text-2xl font-serif text-white heading text-glow navbar-accent'>ZUTHERION BIOVANCE</h1>
        <li className='mt-3 text-xl text-white navbar-btn hover-green'>About</li>
      </ul>
    </div>
  )
}

export default Navbar
