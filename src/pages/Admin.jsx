import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BlogEditor from '../components/BlogEditor'
import AdminGallery from '../components/AdminGallery'
import { useAuth } from '../contexts/AuthContext'
import { FileText, Users, Image, BarChart3, Settings, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [editingBlog, setEditingBlog] = useState(null)
  const [stats, setStats] = useState({
    totalBlogs: 0,
    newsletterSubs: 0,
    waitlist: 0,
    mediaFiles: 0
  })
  const { user, signOut, isAuthenticated } = useAuth()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login'
    }
  }, [isAuthenticated])

  // Fetch real stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        let blogsCountValue = 0

        // Fetch blogs count with error handling
        try {
          const { count: blogsCount } = await supabase
            .from('blogs')
            .select('*', { count: 'exact', head: true })
          blogsCountValue = blogsCount || 0
        } catch (error) {
          console.warn('Blogs table not found, using 0 count')
          blogsCountValue = 0
        }

        // Fetch media files count
        let mediaCount = 0
        try {
          const { data: mediaData } = await supabase.storage
            .from('test-bucket')
            .list('', { limit: 1000 })
          mediaCount = mediaData?.length || 0
        } catch (error) {
          console.warn('Error fetching media count:', error)
          mediaCount = 0
        }

        // For now, keep newsletter and waitlist as demo data since we don't have those tables
        setStats({
          totalBlogs: blogsCountValue,
          newsletterSubs: 156, // demo
          waitlist: 89, // demo
          mediaFiles: mediaCount
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Set default values on error
        setStats({
          totalBlogs: 0,
          newsletterSubs: 156,
          waitlist: 89,
          mediaFiles: 0
        })
      }
    }

    if (isAuthenticated()) {
      fetchStats()
    }
  }, [isAuthenticated])



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
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className='py-8 bg-white border-b border-gray-200'>
        <div className='container mx-auto px-6'>
          <div className='flex flex-wrap justify-between items-center gap-4'>
            <div className='flex flex-wrap gap-2'>
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'blogs', label: 'Blog Writing', icon: FileText },
                { id: 'users', label: 'Users & Members', icon: Users },
                { id: 'gallery', label: 'Media Gallery', icon: Image },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className='flex items-center gap-4'>
              <span className='text-sm text-gray-600'>
                Welcome, <span className='font-medium text-green-700'>{user?.email}</span>
              </span>
              <button
                onClick={async () => {
                  await signOut()
                  window.location.href = '/'
                }}
                className='flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className='py-8 bg-gray-50 min-h-screen'>
        <div className='container mx-auto px-6'>
          {activeTab === 'overview' && (
            <div className='space-y-8'>
              <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium text-gray-600'>Total Blogs</p>
                      <p className='text-2xl font-bold text-gray-900'>{stats.totalBlogs}</p>
                    </div>
                    <FileText className='w-8 h-8 text-blue-600' />
                  </div>
                </div>
                <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium text-gray-600'>Newsletter Subs</p>
                      <p className='text-2xl font-bold text-gray-900'>{stats.newsletterSubs}</p>
                    </div>
                    <Users className='w-8 h-8 text-green-600' />
                  </div>
                </div>
                <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium text-gray-600'>Waitlist</p>
                      <p className='text-2xl font-bold text-gray-900'>{stats.waitlist}</p>
                    </div>
                    <Users className='w-8 h-8 text-purple-600' />
                  </div>
                </div>
                <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium text-gray-600'>Media Files</p>
                      <p className='text-2xl font-bold text-gray-900'>{stats.mediaFiles}</p>
                    </div>
                    <Image className='w-8 h-8 text-orange-600' />
                  </div>
                </div>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Recent Activity</h3>
                <div className='space-y-3'>
                  <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                    <span className='text-sm text-gray-600'>New blog post published: "AI Conservation Advances"</span>
                    <span className='text-xs text-gray-400 ml-auto'>2 hours ago</span>
                  </div>
                  <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                    <span className='text-sm text-gray-600'>5 new newsletter subscribers</span>
                    <span className='text-xs text-gray-400 ml-auto'>4 hours ago</span>
                  </div>
                  <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                    <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                    <span className='text-sm text-gray-600'>3 new waitlist signups</span>
                    <span className='text-xs text-gray-400 ml-auto'>6 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'blogs' && (
            <BlogEditor editingBlog={editingBlog} onSave={() => { setEditingBlog(null); window.location.reload(); }} />
          )}

          {activeTab === 'users' && (
            <div className='space-y-8'>
              <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>User Management</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>Newsletter Subscribers</h3>
                    <div className='space-y-3 max-h-96 overflow-y-auto'>
                      <div className='text-center py-8 text-gray-500'>
                        <Users className='w-12 h-12 mx-auto mb-3 opacity-50' />
                        <p>No subscribers data available</p>
                        <p className='text-sm'>Newsletter integration coming soon</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>Waitlist Members</h3>
                    <div className='space-y-3 max-h-96 overflow-y-auto'>
                      <div className='text-center py-8 text-gray-500'>
                        <Users className='w-12 h-12 mx-auto mb-3 opacity-50' />
                        <p>No waitlist data available</p>
                        <p className='text-sm'>Waitlist integration coming soon</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && <AdminGallery />}

          {activeTab === 'settings' && (
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Settings</h2>
              <div className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Site Title</label>
                  <input type='text' defaultValue='Zutherion Biovance' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent' />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Admin Email</label>
                  <input type='email' defaultValue='admin@zutherionbiovance.com' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent' />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Newsletter Settings</label>
                  <div className='space-y-2'>
                    <label className='flex items-center'>
                      <input type='checkbox' defaultChecked className='mr-2' />
                      Auto-send welcome emails
                    </label>
                    <label className='flex items-center'>
                      <input type='checkbox' defaultChecked className='mr-2' />
                      Enable double opt-in
                    </label>
                  </div>
                </div>
                <button className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors'>
                  Save Settings
                </button>
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