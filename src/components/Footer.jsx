import React, { useState } from 'react';
import { GlowingButton } from './ui/glowing-button';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setIsValid(true);
      setIsSubmitted(true);
      // Here you would typically send the email to your backend
      console.log('Newsletter signup:', email);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    } else {
      setIsValid(false);
    }
  };

  const socialIcons = [
    { name: 'Twitter', icon: '𝕏', url: '#' },
    { name: 'LinkedIn', icon: '💼', url: '#' },
    { name: 'GitHub', icon: '⚡', url: '#' },
    { name: 'ResearchGate', icon: '🔬', url: '#' }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* Curved wave divider at top */}
      <div className="absolute top-0 left-0 w-full h-16 overflow-hidden">
        <svg
          className="absolute bottom-0 overflow-hidden"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          version="1.1"
          viewBox="0 0 2560 100"
          x="0"
          y="0"
        >
          <polygon
            className="fill-current text-gray-900"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>

      {/* Glow effect at the top */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-500/10 to-transparent"></div>

      <div className="relative z-10 pt-20 pb-12 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <svg className='w-8 h-8 mr-3' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M12 2L13.09 8.26L22 9L16.18 13.74L17.27 21L12 17.77L6.73 21L7.82 13.74L2 9L10.91 8.26L12 2Z' fill='white' opacity='0.8'/>
                  <path d='M12 2L13.09 8.26L22 9L16.18 13.74L17.27 21L12 17.77L6.73 21L7.82 13.74L2 9L10.91 8.26L12 2Z' stroke='white' strokeWidth='1'/>
                  <animateTransform attributeName='transform' attributeType='XML' type='rotate' from='0 12 12' to='360 12 12' dur='6s' repeatCount='indefinite'/>
                </svg>
                <h3 className="text-2xl font-bold space-grotesk text-white">ZYTHERION BIOVANCE</h3>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Pioneering nature-inspired AI solutions for wildlife conservation and environmental sustainability.
                Driving research and global scientific collaboration to protect our planet's biodiversity.
              </p>
              <div className="flex space-x-4">
                {socialIcons.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-xl transition-all duration-300 hover:bg-white/20 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/20"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter signup */}
            <div className="lg:col-span-2">
              <h4 className="text-xl font-bold mb-6 space-grotesk text-white">Stay Connected</h4>
              <p className="text-gray-300 mb-6">
                Get the latest updates on our research, conservation projects, and AI innovations.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (!isValid) setIsValid(true);
                    }}
                    placeholder="Enter your email"
                    className={`flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 ${
                      !isValid ? 'border-red-500' : 'border-white/20'
                    }`}
                    required
                  />
                  <GlowingButton
                    type="submit"
                    className="px-6 py-3 text-white bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 rounded-lg font-medium transition-all duration-300 whitespace-nowrap"
                    glowColor="#14B8A6"
                  >
                    {isSubmitted ? '✓ Subscribed!' : 'Subscribe'}
                  </GlowingButton>
                </div>
                {!isValid && (
                  <p className="text-red-400 text-sm">Please enter a valid email address.</p>
                )}
                {isSubmitted && (
                  <p className="text-green-400 text-sm">Thank you for subscribing! We'll keep you updated.</p>
                )}
              </form>
            </div>
          </div>

          {/* Bottom section with links and copyright */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                © 2024 Zytherion Biovance. All rights reserved.
              </div>
              <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">Contact Us</a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">Research</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-teal-500 rounded-full blur-3xl"></div>
      </div>
    </footer>
  );
};

export default Footer;