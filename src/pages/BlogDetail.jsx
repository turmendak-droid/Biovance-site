import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

const BlogDetail = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          console.error('Error fetching blog:', error)
        } else {
          setBlog(data)
        }
      } catch (error) {
        console.error('Error fetching blog:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBlog()
    }
  }, [id])

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center'>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
        <Navbar />
        <div className='pt-20 pb-12'>
          <div className='container mx-auto px-6 text-center'>
            <h1 className='text-2xl font-bold text-gray-900 mb-4'>Blog not found</h1>
            <Link to='/updates' className='text-green-600 hover:text-green-800'>← Back to Updates</Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      <Navbar />
      <section className='pt-20 pb-12'>
        <div className='container mx-auto px-6'>
          <Link to='/updates' className='inline-flex items-center text-green-600 hover:text-green-800 transition-colors mb-6'>
            ← Back to Updates
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img src={blog.featured_image || '/assets/41308.jpg'} alt={blog.title} className='w-full h-64 object-cover rounded-xl mb-8' />
            <h1 className='text-4xl font-bold font-["Space_Grotesk"] text-green-900 mb-4'>{blog.title}</h1>
            <p className='text-gray-600 mb-8'>{new Date(blog.created_at).toLocaleDateString()}</p>
            <div className='prose max-w-none' dangerouslySetInnerHTML={{ __html: blog.content }} />
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default BlogDetail