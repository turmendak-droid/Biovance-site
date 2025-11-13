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
  const [blogs, setBlogs] = useState([])
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

        // Fetch newsletter subscribers count
        let newsletterCount = 0
        try {
          const { count: newsletterSubsCount } = await supabase
            .from('newsletter_subscribers')
            .select('*', { count: 'exact', head: true })
          newsletterCount = newsletterSubsCount || 0
        } catch (error) {
          console.warn('Newsletter subscribers table not found, using 0 count')
          newsletterCount = 0
        }

        // Fetch waitlist count
        let waitlistCount = 0
        try {
          const { count: waitlistSubsCount } = await supabase
            .from('waitlist')
            .select('*', { count: 'exact', head: true })
          waitlistCount = waitlistSubsCount || 0
        } catch (error) {
          console.warn('Waitlist table not found, using 0 count')
          waitlistCount = 0
        }

        setStats({
          totalBlogs: blogsCountValue,
          newsletterSubs: newsletterCount,
          waitlist: waitlistCount,
          mediaFiles: mediaCount
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Set default values on error
        setStats({
          totalBlogs: 0,
          newsletterSubs: 0,
          waitlist: 0,
          mediaFiles: 0
        })
      }
    }

    if (isAuthenticated()) {
      fetchStats()
    }
  }, [isAuthenticated])

  // Fetch blogs for management
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching blogs:', error)
          return
        }

        setBlogs(data || [])
      } catch (error) {
        console.error('Error fetching blogs:', error)
      }
    }

    if (isAuthenticated()) {
      fetchBlogs()
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
        // Refresh the blogs list
        setBlogs(blogs.filter(b => b.id !== id))
        alert("Blog deleted successfully!")
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
                { id: 'waitlist', label: 'Waitlist', icon: Users },
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
            <div className='space-y-8'>
              {editingBlog ? (
                // Show editor when editing
                <div>
                  <button
                    onClick={() => setEditingBlog(null)}
                    className='mb-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors'
                  >
                    ← Back to Blogs List
                  </button>
                  <BlogEditor
                    editingBlog={editingBlog}
                    onSave={() => {
                      setEditingBlog(null);
                      // Refresh blogs list
                      window.location.reload();
                    }}
                  />
                </div>
              ) : (
                // Show blogs list
                <div className='space-y-6'>
                  <div className='flex justify-between items-center'>
                    <h2 className='text-2xl font-bold text-gray-900'>Blog Management</h2>
                    <button
                      onClick={() => setEditingBlog({})} // Empty object for new blog
                      className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2'
                    >
                      ✏️ Write New Blog
                    </button>
                  </div>

                  {blogs.length === 0 ? (
                    <div className='bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center'>
                      <FileText className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                      <h3 className='text-lg font-semibold text-gray-900 mb-2'>No blogs yet</h3>
                      <p className='text-gray-600 mb-4'>Create your first blog post to get started.</p>
                      <button
                        onClick={() => setEditingBlog({})} // Empty object for new blog
                        className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors'
                      >
                        Create First Blog
                      </button>
                    </div>
                  ) : (
                    <div className='grid gap-4'>
                      {blogs.map((blog) => (
                        <div key={blog.id} className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
                          <div className='flex justify-between items-start'>
                            <div className='flex-1'>
                              <h3 className='text-xl font-semibold text-gray-900 mb-2'>{blog.title}</h3>
                              <p className='text-gray-600 mb-3 line-clamp-2'>{blog.excerpt || 'No excerpt'}</p>
                              <div className='flex items-center gap-4 text-sm text-gray-500'>
                                <span>By {blog.author || 'Unknown'}</span>
                                <span>•</span>
                                <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                                <span>•</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  blog.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {blog.published ? 'Published' : 'Draft'}
                                </span>
                              </div>
                            </div>
                            <div className='flex gap-2 ml-4'>
                              <button
                                onClick={() => handleEditBlog(blog)}
                                className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2'
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(blog.id)}
                                className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2'
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </div>
                          {blog.featured_image && (
                            <div className='mt-4'>
                              <img
                                src={blog.featured_image}
                                alt="Featured"
                                className='w-32 h-20 object-cover rounded-lg border border-gray-200'
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
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

          {activeTab === 'waitlist' && (
            <div className='space-y-8'>
              <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-2xl font-bold text-gray-900'>Waitlist Management</h2>
                  <Link
                    to="/admin/waitlist"
                    className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2'
                  >
                    📋 View Full Waitlist
                  </Link>
                </div>
                <p className='text-gray-600 mb-6'>Monitor and manage waitlist registrations. Click "View Full Waitlist" for detailed management.</p>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div className='bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium text-purple-700'>Total Signups</p>
                        <p className='text-3xl font-bold text-purple-900'>{stats.waitlist}</p>
                      </div>
                      <Users className='w-10 h-10 text-purple-600' />
                    </div>
                  </div>

                  <div className='bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium text-green-700'>This Month</p>
                        <p className='text-3xl font-bold text-green-900'>--</p>
                      </div>
                      <BarChart3 className='w-10 h-10 text-green-600' />
                    </div>
                  </div>

                  <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium text-blue-700'>Conversion Rate</p>
                        <p className='text-3xl font-bold text-blue-900'>--</p>
                      </div>
                      <Settings className='w-10 h-10 text-blue-600' />
                    </div>
                  </div>
                </div>

                <div className='mt-8'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>Quick Actions</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Link
                      to="/admin/waitlist"
                      className='bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors flex items-center gap-3'
                    >
                      <Users className='w-5 h-5' />
                      <div>
                        <div className='font-semibold'>View All Entries</div>
                        <div className='text-sm opacity-90'>Detailed waitlist management</div>
                      </div>
                    </Link>

                    <button className='bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors flex items-center gap-3'>
                      <FileText className='w-5 h-5' />
                      <div>
                        <div className='font-semibold'>Export Data</div>
                        <div className='text-sm opacity-90'>Download CSV file</div>
                      </div>
                    </button>
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