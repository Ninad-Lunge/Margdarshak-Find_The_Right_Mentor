import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Plus, Edit3, Trash2 } from 'lucide-react';

// CreateBlogForm Component
const CreateBlogForm = ({ communityId, onCreateBlog, onCancel }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    link: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    // Basic validation
    if (!newBlog.title.trim() || !newBlog.content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in.');
        return;
      }

      const response = await axios.post(`https://margdarshak-find-the-right-mentor.onrender.com/api/communities/${communityId}/blogs`, newBlog, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Clear form and call parent's create method
      onCreateBlog(response.data);
      setNewBlog({ title: '', content: '', link: '' });
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating blog');
      console.error('Error creating blog:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <h3 className="text-xl font-semibold mb-4">Create New Blog Post</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">📝</span>
          <input
            type="text"
            placeholder="Blog Title"
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-gray-400">🔗</span>
          <input
            type="url"
            placeholder="Blog Link (optional)"
            value={newBlog.link}
            onChange={(e) => setNewBlog({ ...newBlog, link: e.target.value })}
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-start space-x-2">
          <span className="text-gray-400 mt-2">📄</span>
          <textarea
            placeholder="Blog Content"
            value={newBlog.content}
            onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
            className="flex-1 p-2 border border-gray-300 rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Blog Post
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// EditBlogForm Component
const EditBlogForm = ({ blog, onUpdateBlog, onCancel }) => {
  const [updatedBlog, setUpdatedBlog] = useState({
    title: blog.title,
    content: blog.content,
    link: blog.link || '',
  });
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    if (!updatedBlog.title.trim() || !updatedBlog.content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://margdarshak-find-the-right-mentor.onrender.com/api/communities/${blog.community}/blogs/${blog._id}`, 
        updatedBlog, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      onUpdateBlog(response.data);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating blog');
      console.error('Error updating blog:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <h3 className="text-xl font-semibold mb-4">Edit Blog Post</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">📝</span>
          <input
            type="text"
            placeholder="Blog Title"
            value={updatedBlog.title}
            onChange={(e) => setUpdatedBlog({ ...updatedBlog, title: e.target.value })}
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-gray-400">🔗</span>
          <input
            type="url"
            placeholder="Blog Link (optional)"
            value={updatedBlog.link}
            onChange={(e) => setUpdatedBlog({ ...updatedBlog, link: e.target.value })}
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-start space-x-2">
          <span className="text-gray-400 mt-2">📄</span>
          <textarea
            placeholder="Blog Content"
            value={updatedBlog.content}
            onChange={(e) => setUpdatedBlog({ ...updatedBlog, content: e.target.value })}
            className="flex-1 p-2 border border-gray-300 rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleUpdate}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Update Blog Post
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const CommunityView = ({ community, onBack }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authorization token is missing.');
          setLoading(false);
          return;
        }
  
        const response = await axios.get(`https://margdarshak-find-the-right-mentor.onrender.com/api/communities/${community._id}/blogs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        setBlogs(response.data.blogs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
  
        if (error.response) {
          setError(
            error.response.data.message || 
            `Server error: ${error.response.status}`
          );
        } else if (error.request) {
          // Request was made but no response received
          setError('No response received from server.');
        } else {
          // Something else went wrong
          setError('Failed to fetch blogs. Please try again later.');
        }
  
        setLoading(false);
      }
    };
  
    if (community && community._id) {
      fetchBlogs();
    }
  }, [community?._id]);
  

  const handleCreateBlog = (newBlog) => {
    setBlogs([newBlog, ...blogs]);
    setShowBlogForm(false);
  };

  const handleUpdateBlog = (updatedBlog) => {
    setBlogs(blogs.map(blog => 
      blog._id === updatedBlog._id ? updatedBlog : blog
    ));
    setEditingBlog(null);
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      if (!community?._id || !blogId) throw new Error('Invalid Community or Blog ID');
  
      const response = await axios.delete(`https://margdarshak-find-the-right-mentor.onrender.com/api/communities/${community._id}/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      console.log('Delete response:', response.data); // Optional debugging
      setBlogs(blogs.filter(blog => blog._id !== blogId));
    } catch (error) {
      console.error('Error deleting blog:', error.toJSON());
      console.error('Error response data:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to delete blog');
    }
  };
  
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" /> 
        Back to Communities 
      </button>

      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h2 className="text-2xl font-bold mb-2">{community.title}</h2>
        <p className="text-gray-600">{community.description}</p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Blogs</h3>
          {!showBlogForm && !editingBlog && (
            <button
              onClick={() => setShowBlogForm(true)}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Write New Blog
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}

        {showBlogForm && (
          <CreateBlogForm
            communityId={community._id}
            onCreateBlog={handleCreateBlog}
            onCancel={() => setShowBlogForm(false)}
          />
        )}

        {editingBlog && (
          <EditBlogForm
            blog={editingBlog}
            onUpdateBlog={handleUpdateBlog}
            onCancel={() => setEditingBlog(null)}
          />
        )}

        {loading ? (
          <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">Loading blogs...</p>
        ) : blogs.length > 0 ? (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div key={blog._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow relative">
                <h4 className="text-lg font-medium mb-2">{blog.title}</h4>
                {blog.link && (
                  <a
                    href={blog.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2"
                  >
                    <span className="mr-1">🔗</span>
                    View Original Post
                  </a>
                )}
                <p className="text-gray-600 mb-4">{blog.content}</p>
                
                {/* Author and Blog Management */}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    By {blog.author?.name || 'Anonymous'} 
                    {blog.author?.email ? ` (${blog.author.email})` : ''}
                  </span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setEditingBlog(blog)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteBlog(blog._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
            No blogs yet in this community. Be the first to write one!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommunityView;