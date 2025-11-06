import React from 'react'
import { GlowingButton } from './ui/glowing-button'

const Navbar = () => {
  return (
    <div className='h-20 w-full bg-white/10 backdrop-blur-md border border-white/20 relative z-30
    flex rounded-br-2xl rounded-bl-2xl shadow-lg'>
      <div className='flex items-center h-full ml-10'>
        <svg className='w-8 h-8 mr-3' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path d='M12 2L13.09 8.26L22 9L16.18 13.74L17.27 21L12 17.77L6.73 21L7.82 13.74L2 9L10.91 8.26L12 2Z' fill='white' opacity='0.8'/>
          <path d='M12 2L13.09 8.26L22 9L16.18 13.74L17.27 21L12 17.77L6.73 21L7.82 13.74L2 9L10.91 8.26L12 2Z' stroke='white' strokeWidth='1'/>
          <animateTransform attributeName='transform' attributeType='XML' type='rotate' from='0 12 12' to='360 12 12' dur='6s' repeatCount='indefinite'/>
        </svg>
        <h1 className='text-2xl font-serif text-white heading text-glow navbar-accent'>ZUTHERION BIOVANCE</h1>
      </div>
      <ul className='flex items-center gap-8 ml-auto mr-10 h-full'>

        <a href="">
        <li className='text-xl text-white navbar-btn backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-4 py-2
        transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg no-underline'>Home
        </li>
        </a>

        <a href="">
        <li className='text-xl text-white navbar-btn backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-4 py-2
        transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg no-underline'>
        Updates
        </li>
        </a>

        <a href="">
        <li className='text-xl text-white navbar-btn backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-4 py-2
        transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg no-underline'>About</li>
        </a>

        <GlowingButton className="text-white backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-4 py-2 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg" glowColor="#22c55e">
          Join Waitlist
        </GlowingButton>
      </ul>
    </div>
  )
}

export default Navbar
