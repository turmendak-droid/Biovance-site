import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { GlowingButton } from './ui/glowing-button'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='h-16 md:h-20 w-full bg-black/20 backdrop-blur-md border border-white/20 fixed top-0 left-0 z-30 flex rounded-br-2xl rounded-bl-2xl shadow-lg'>
      <div className='flex items-center h-full ml-4 md:ml-10'>
        <h1 className='text-lg md:text-2xl font-serif text-white heading text-glow navbar-accent'>ZUTHERION BIOVANCE</h1>
      </div>

      {/* Desktop Menu */}
      <ul className='hidden md:flex items-center gap-4 lg:gap-8 ml-auto mr-4 lg:mr-10 h-full'>
        <Link to="/">
         <li className='text-lg lg:text-xl text-white navbar-btn backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-3 lg:px-4 py-2
         transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg no-underline'>Home
         </li>
         </Link>

         <li onClick={() => { const element = document.getElementById('about'); if (element) window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' }); }} className='text-lg lg:text-xl text-white navbar-btn backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-3 lg:px-4 py-2
         transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg no-underline cursor-pointer'>About</li>

         <Link to="/updates">
         <li className='text-lg lg:text-xl text-white navbar-btn backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-3 lg:px-4 py-2
         transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg no-underline'>
         Updates
         </li>
         </Link>

         <Link to="/waitlist">
         <GlowingButton className="text-white backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-3 lg:px-4 py-2 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg" glowColor="#22c55e">
           Join Waitlist
         </GlowingButton>
         </Link>
      </ul>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='md:hidden ml-auto mr-4 p-2 text-white'
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/20 rounded-br-2xl rounded-bl-2xl shadow-lg'>
          <ul className='flex flex-col py-4'>
            <Link to="/" onClick={() => setIsOpen(false)}>
              <li className='text-white py-3 px-6 hover:bg-white/10 transition-colors'>Home</li>
            </Link>
            <li
              onClick={() => {
                const element = document.getElementById('about');
                if (element) window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
                setIsOpen(false);
              }}
              className='text-white py-3 px-6 hover:bg-white/10 transition-colors cursor-pointer'
            >
              About
            </li>
            <Link to="/updates" onClick={() => setIsOpen(false)}>
              <li className='text-white py-3 px-6 hover:bg-white/10 transition-colors'>Updates</li>
            </Link>
            <li className='px-6 py-3'>
              <Link to="/waitlist" onClick={() => setIsOpen(false)}>
                <GlowingButton className="w-full text-white backdrop-blur-sm bg-white/10 border border-white/20 rounded-full py-2 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg" glowColor="#22c55e">
                  Join Waitlist
                </GlowingButton>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Navbar
