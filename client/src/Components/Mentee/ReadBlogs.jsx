import React, { useState, useEffect } from "react";
import axios from "axios";

const BlogCard = ({ blog, onLike, onDislike }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-xl font-semibold">{blog.title}</h3>
      <p className="text-gray-600 mt-2">{blog.content}</p>
      {blog.link && (
        <a
          href={blog.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline mt-2 block"
        >
          Visit Link
        </a>
      )}
      <div className="flex items-center mt-4 gap-4">
        <button
          onClick={() => onLike(blog._id)}
          className="text-green-600 hover:text-green-800"
        >
          Like ({blog.likes})
        </button>
        <button
          onClick={() => onDislike(blog._id)}
          className="text-red-600 hover:text-red-800"
        >
          Dislike ({blog.dislikes})
        </button>
        
      </div>
    </div>
  );
};

const ReadBlogs = ({ community, onBack }) => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/communities/${community._id}/blogs`
      );
      const blogsData = Array.isArray(response.data) ? response.data : response.data.blogs || [];
      setBlogs(blogsData);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setError("Failed to fetch blogs");
    }
  };
  

  const handleLike = async (blogId) => {
    try {
      // Make the API request and store the response
      const response = await axios.post(
        `http://localhost:5000/api/blogs/${blogId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Update the blog's like count in the state
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId ? { ...blog, likes: response.data.likes } : blog
        )
      );
    } catch (err) {
      console.error("Failed to like blog", err);
    }
  };
  
  const handleDislike = async (blogId) => {
    try {
      // Make the API request and store the response
      const response = await axios.post(
        `http://localhost:5000/api/blogs/${blogId}/dislike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Update the blog's dislike count in the state
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId ? { ...blog, dislikes: response.data.dislikes } : blog
        )
      );

    } catch (err) {
      console.error("Failed to dislike blog", err);
    }
  };
  

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={onBack}
        className="text-blue-600 hover:underline mb-4 block"
      >
        Back to Communities
      </button>
      <h2 className="text-3xl font-bold mb-6">{community.title}</h2>
      <p className="text-gray-600 mb-6">{community.description}</p>

      {error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="flex flex-col gap-4">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              onLike={handleLike}
              onDislike={handleDislike}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadBlogs;
