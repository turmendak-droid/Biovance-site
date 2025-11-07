import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Twitter, Linkedin, Github, Globe } from 'lucide-react'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [isValid, setIsValid] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateEmail(email)) {
      setIsValid(true)
      setIsSubmitted(true)
      console.log('Newsletter signup:', email)
      setEmail('')
      setTimeout(() => setIsSubmitted(false), 3000)
    } else {
      setIsValid(false)
    }
  }

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative bg-gradient-to-b from-emerald-50 to-white text-gray-700 py-16 border-t border-green-100 shadow-inner"
    >
      {/* Seamless blend with previous section */}
      <div className="absolute -top-8 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-emerald-50"></div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <svg className='w-8 h-8' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M12 2L13.09 8.26L22 9L16.18 13.74L17.27 21L12 17.77L6.73 21L7.82 13.74L2 9L10.91 8.26L12 2Z' fill='currentColor' opacity='0.8'/>
                <path d='M12 2L13.09 8.26L22 9L16.18 13.74L17.27 21L12 17.77L6.73 21L7.82 13.74L2 9L10.91 8.26L12 2Z' stroke='currentColor' strokeWidth='1'/>
                <animateTransform attributeName='transform' attributeType='XML' type='rotate' from='0 12 12' to='360 12 12' dur='6s' repeatCount='indefinite'/>
              </svg>
              <h3 className="text-xl font-semibold font-['Space_Grotesk'] tracking-tight text-green-800">
                ZUTHERION BIOVANCE
              </h3>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed max-w-md mb-6">
              Advancing AI-driven solutions for wildlife conservation, ecosystem restoration, and global collaboration.
            </p>

            <div className="flex gap-4">
              <a href="#" className="text-green-700 hover:text-green-900 transition-colors duration-300 hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-green-700 hover:text-green-900 transition-colors duration-300 hover:scale-110">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-green-700 hover:text-green-900 transition-colors duration-300 hover:scale-110">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-green-700 hover:text-green-900 transition-colors duration-300 hover:scale-110">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Newsletter Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="md:text-right"
          >
            <h4 className="text-lg font-semibold font-['Space_Grotesk'] text-green-800 mb-3">
              Stay Connected
            </h4>
            <p className="text-gray-600 text-sm mb-6">
              Get the latest updates on research, AI initiatives, and ecological intelligence.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex md:justify-end gap-2">
                <div className="relative flex-1 md:max-w-xs">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (!isValid) setIsValid(true)
                    }}
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all ${
                      !isValid ? 'border-red-400' : 'border-green-200'
                    }`}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg hover:scale-105 transition-all flex items-center gap-2 font-medium"
                >
                  {isSubmitted ? '✓' : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>

              {!isValid && (
                <p className="text-red-500 text-sm">Please enter a valid email address.</p>
              )}
              {isSubmitted && (
                <p className="text-green-600 text-sm">Thank you for subscribing!</p>
              )}
            </form>

            <div className="mt-6 pt-6 border-t border-green-100">
              <p className="text-xs text-gray-500">
                Data integrity verified by Supabase • Supported by Arizona Ecological Board
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 pt-6 border-t border-green-100 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500"
        >
          <div>
            © 2024 Zutherion Biovance. All rights reserved.
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-green-700 transition-colors">Privacy</a>
            <a href="#" className="hover:text-green-700 transition-colors">Terms</a>
            <a href="#" className="hover:text-green-700 transition-colors">Contact</a>
            <a href="#" className="hover:text-green-700 transition-colors">Research</a>
          </div>
        </motion.div>
      </div>

      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-emerald-400 rounded-full blur-3xl"></div>
      </div>
    </motion.footer>
  )
}

export default Footer;