import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import BlogEditor from '../components/BlogEditor'

const Admin = () => {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [members, setMembers] = useState([])
  const [waitlist, setWaitlist] = useState([])
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingBlog, setEditingBlog] = useState(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        fetchData()
      } else {
        setLoading(false)
      }
    }

    const fetchData = async () => {
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false })

      const { data: waitlistData, error: waitlistError } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false })

      const { data: blogsData, error: blogsError } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })

      if (membersError) {
        console.error("❌ Members fetch error:", membersError.message)
      } else {
        console.log("✅ Members loaded:", membersData)
        setMembers(membersData || [])
      }

      if (waitlistError) {
        console.error("❌ Waitlist fetch error:", waitlistError.message)
      } else {
        console.log("✅ Waitlist loaded:", waitlistData)
        setWaitlist(waitlistData || [])
      }

      if (blogsError) {
        console.error("❌ Blogs fetch error:", blogsError.message)
      } else {
        console.log("✅ Blogs loaded:", blogsData)
        setBlogs(blogsData || [])
      }

      setLoading(false)
    }

    checkUser()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error("❌ Login error:", error.message)
      alert("Login failed: " + error.message)
    } else {
      console.log("✅ Logged in")
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      // Fetch data after login
      const fetchData = async () => {
        const { data: membersData, error: membersError } = await supabase
          .from('members')
          .select('*')
          .order('created_at', { ascending: false })

        const { data: waitlistData, error: waitlistError } = await supabase
          .from('waitlist')
          .select('*')
          .order('created_at', { ascending: false })

        const { data: blogsData, error: blogsError } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false })

        if (membersError) {
          console.error("❌ Members fetch error:", membersError.message)
        } else {
          setMembers(membersData || [])
        }

        if (waitlistError) {
          console.error("❌ Waitlist fetch error:", waitlistError.message)
        } else {
          setWaitlist(waitlistData || [])
        }

        if (blogsError) {
          console.error("❌ Blogs fetch error:", blogsError.message)
        } else {
          setBlogs(blogsData || [])
        }

        setLoading(false)
      }
      fetchData()
    }
    setLoginLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setMembers([])
    setWaitlist([])
    setBlogs([])
    setEditingBlog(null)
  }

  const handleEditBlog = (blog) => {
    setEditingBlog(blog)
  }

  const handleDeleteBlog = async (id) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id)

      if (error) {
        console.error("Delete error:", error.message)
        alert("Failed to delete blog")
      } else {
        setBlogs(blogs.filter(b => b.id !== id))
      }
    }
  }


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
          <div className='max-w-4xl'>
            <Link to='/' className='inline-flex items-center text-green-200 hover:text-white transition-colors mb-6 text-sm font-["Inter"]'>
              ← Back to Home
            </Link>
            <h1 className='text-5xl md:text-6xl font-bold font-["Space_Grotesk"] mb-6'>
              🛠️ Admin Dashboard
            </h1>
            <p className='text-xl font-["Inter"] text-green-100 leading-relaxed max-w-3xl'>
              Manage your blog posts, newsletter subscribers, and waitlist members with ease.
            </p>
            {user && (
              <button
                onClick={handleLogout}
                className='mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors shadow-lg'
              >
                🚪 Logout
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Data Sections */}
      <section className='py-20 bg-gray-50'>
        <div className='container mx-auto px-6'>
          {!user ? (
            <div className='max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-200'>
              <h2 className='text-3xl font-bold font-["Space_Grotesk"] text-green-900 mb-6 text-center'>
                🔐 Admin Login
              </h2>
              <form onSubmit={handleLogin} className='space-y-4'>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Email'
                  className='w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm'
                  required
                />
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Password'
                  className='w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm'
                  required
                />
                <button
                  type='submit'
                  disabled={loginLoading}
                  className='w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg transition-colors disabled:opacity-50 font-semibold shadow-md'
                >
                  {loginLoading ? '🔄 Logging in...' : '🚀 Login'}
                </button>
              </form>
            </div>
          ) : loading ? (
            <div className='text-center py-20'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto'></div>
              <p className='mt-4 text-gray-600 font-medium'>Loading dashboard...</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              <BlogEditor editingBlog={editingBlog} onSave={() => { setEditingBlog(null); fetchData(); }} />

              {/* Blogs List */}
              <div>
                <h2 className='text-3xl font-bold font-["Space_Grotesk"] text-green-900 mb-6'>
                  Existing Blogs ({blogs.length})
                </h2>
                {blogs.length === 0 ? (
                  <p className="text-gray-600 text-center">No blogs yet.</p>
                ) : (
                  <div className='overflow-x-auto'>
                    <table className='min-w-full bg-white border border-gray-300'>
                      <thead>
                        <tr className='bg-gray-100'>
                          <th className='py-2 px-4 border-b'>ID</th>
                          <th className='py-2 px-4 border-b'>Title</th>
                          <th className='py-2 px-4 border-b'>Created At</th>
                          <th className='py-2 px-4 border-b'>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blogs.map((blog) => (
                          <tr key={blog.id} className='hover:bg-gray-50'>
                            <td className='py-2 px-4 border-b'>{blog.id}</td>
                            <td className='py-2 px-4 border-b'>{blog.title}</td>
                            <td className='py-2 px-4 border-b'>{new Date(blog.created_at).toLocaleString()}</td>
                            <td className='py-2 px-4 border-b'>
                              <button
                                onClick={() => handleEditBlog(blog)}
                                className='bg-blue-600 text-white px-2 py-1 rounded mr-2 hover:bg-blue-700'
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(blog.id)}
                                className='bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700'
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>


              {/* Member Analytics */}
              <div className='lg:col-span-2'>
                <h2 className='text-3xl font-bold font-["Space_Grotesk"] text-green-900 mb-6'>
                  📊 Member Analytics
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                  <div className='bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200'>
                    <h3 className='text-lg font-semibold text-green-800 mb-2'>Newsletter Subscribers</h3>
                    <p className='text-3xl font-bold text-green-900'>{members.length}</p>
                    <p className='text-sm text-green-600 mt-2'>Active email list</p>
                  </div>
                  <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200'>
                    <h3 className='text-lg font-semibold text-blue-800 mb-2'>Waitlist Members</h3>
                    <p className='text-3xl font-bold text-blue-900'>{waitlist.length}</p>
                    <p className='text-sm text-blue-600 mt-2'>Interested prospects</p>
                  </div>
                  <div className='bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200'>
                    <h3 className='text-lg font-semibold text-purple-800 mb-2'>Total Engagement</h3>
                    <p className='text-3xl font-bold text-purple-900'>{members.length + waitlist.length}</p>
                    <p className='text-sm text-purple-600 mt-2'>Combined audience</p>
                  </div>
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>Recent Activity</h3>
                  <div className='space-y-3 max-h-64 overflow-y-auto'>
                    {[...members.slice(0, 5), ...waitlist.slice(0, 5)].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10).map((item, index) => (
                      <div key={`${item.id}-${index}`} className='flex justify-between items-center bg-gray-50 rounded-lg p-3'>
                        <div>
                          <span className='text-gray-900 font-medium'>{item.email}</span>
                          <span className={`ml-2 text-xs px-2 py-1 rounded ${
                            members.some(m => m.id === item.id) ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {members.some(m => m.id === item.id) ? 'Newsletter' : 'Waitlist'}
                          </span>
                        </div>
                        <span className='text-sm text-gray-500'>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Admin