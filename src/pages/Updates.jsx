import React, { useState, useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

const Updates = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error("❌ Supabase fetch error:", error.message)
        setBlogs([])
      } else {
        console.log("✅ Blogs loaded:", data)
        setBlogs(data || [])
      }
      setLoading(false)
    }

    fetchBlogs()
  }, [])



  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      {/* Navbar */}
      <div className='bg-gradient-to-b from-green-900 to-green-800'>
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className='relative py-20 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-0 left-0 w-96 h-96 bg-green-400 rounded-full blur-3xl'></div>
          <div className='absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl'></div>
        </div>
        
        <div className='container mx-auto px-6 relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='max-w-4xl'
          >
            <Link to='/' className='inline-flex items-center text-green-200 hover:text-white transition-colors mb-6 text-sm font-["Inter"]'>
              ← Back to Home
            </Link>
            <h1 className='text-5xl md:text-6xl font-bold font-["Space_Grotesk"] mb-6'>
              Updates & Research Insights
            </h1>
            <p className='text-xl font-["Inter"] text-green-100 leading-relaxed max-w-3xl'>
              Stay informed about our conservation progress, ecological research, and restoration projects.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='mb-12'
          >
            <h2 className='text-4xl font-bold font-["Space_Grotesk"] text-green-900 mb-4'>
              Latest Updates
            </h2>
            <p className='text-lg font-["Inter"] text-gray-600 max-w-3xl'>
              Our latest research findings, project milestones, and conservation breakthroughs.
            </p>
          </motion.div>

          {loading ? (
            <div className='text-center'>Loading...</div>
          ) : blogs.length === 0 ? (
            <p className="text-gray-600 text-center mt-10">No updates available yet.</p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className='bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden'
                >
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className='w-full h-48 object-cover'
                  />
                  <div className='p-6'>
                    <h3 className='text-lg font-semibold font-["Space_Grotesk"] text-green-900 mb-3'>
                      {blog.title}
                    </h3>
                    <div className='text-gray-700 font-["Inter"] text-sm leading-relaxed mb-4' dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 150) + '...' }} />
                    <Link
                      to={`/blogs/${blog.id}`}
                      className='text-green-600 hover:text-green-800 font-semibold text-sm'
                    >
                      Read More →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* Call to Action */}
      <section className='py-16 bg-gradient-to-r from-green-700 to-emerald-600'>
        <div className='container mx-auto px-6 text-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className='text-3xl font-bold font-["Space_Grotesk"] text-white mb-4'>
              Want to Collaborate on Conservation?
            </h2>
            <p className='text-green-100 font-["Inter"] mb-8 max-w-2xl mx-auto'>
              Join researchers, organizations, and conservationists worldwide in our mission to protect and restore ecosystems.
            </p>
            <Link
              to='/'
              className='inline-flex items-center gap-2 bg-white text-green-800 px-8 py-3 rounded-lg font-semibold font-["Inter"] hover:bg-green-50 transition-colors shadow-lg'
            >
              Get In Touch
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Updates
