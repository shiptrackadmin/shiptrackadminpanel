import React, { useState, useEffect } from 'react';
import { LoginPage } from './views/LoginPage';
import { DashboardView } from './views/DashboardView';
import { BlogListView } from './views/BlogListView';
import { BlogFormView } from './views/BlogFormView';
import { CategoriesView } from './views/CategoriesView';
import { SeoSettingsView } from './views/SeoSettingsView';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

type Page = 'login' | 'dashboard' | 'blog' | 'blog-create' | 'blog-edit' | 'categories' | 'seo';

const API_BASE_URL = 'https://shiptrackadminpanel.onrender.com';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<any>(null);

  const showToast = (title: string, message?: string, type: string = 'success') => {
    setToast({ id: Date.now().toString(), type, title, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const blogsRes = await fetch(`${API_BASE_URL}/api/blogs`, { headers });
        if (blogsRes.ok) {
          const data = await blogsRes.json();
          setPosts(data);
        }
        
        const catsRes = await fetch(`${API_BASE_URL}/api/categories`, { headers });
        if (catsRes.ok) {
          const data = await catsRes.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [isLoggedIn]);

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
    showToast('Signed In Successfully', 'Welcome to ShipTrack CMS');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentPage('login');
    showToast('Signed Out', 'You have been safely logged out.', 'info');
  };

  const handleNavigate = (page: Page) => {
    if (page === 'login') {
      setIsLoggedIn(false);
      setCurrentPage('login');
      return;
    }
    if (page === 'blog-create') {
      setEditingPost(null);
    }
    setCurrentPage(page);
  };

  const handleAddCategory = async (newCat: { name: string; slug: string }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCat)
      });
      if (res.ok) {
        const created = await res.json();
        setCategories([...categories, created]);
        showToast('Category Created', `"${newCat.name}" added successfully.`);
      } else {
        const error = await res.json();
        showToast('Error', error.error || 'Failed to create category', 'error');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      showToast('Error', 'Failed to create category', 'error');
    }
  };

  const handleSavePost = async (postData: any, targetStatus: 'Published' | 'Draft') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Error', 'Please login again', 'error');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const postToSave = {
        ...postData,
        status: targetStatus,
        author: 'Admin',
        publishDate: postData.publishDate || new Date().toISOString().split('T')[0]
      };

      let url = `${API_BASE_URL}/api/blogs`;
      let method = 'POST';

      if (editingPost) {
        const editId = editingPost._id || editingPost.id;
        url = `${API_BASE_URL}/api/blogs/${editId}`;
        method = 'PUT';
      }

      const res = await fetch(url, { 
        method, 
        headers, 
        body: JSON.stringify(postToSave) 
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('API Error:', errorData);
        showToast('Error', errorData.error || 'Failed to save post', 'error');
        return;
      }

      const savedPost = await res.json();
      
      if (editingPost) {
        const editId = editingPost._id || editingPost.id;
        setPosts(posts.map(p => (p._id || p.id) === editId ? savedPost : p));
        showToast(targetStatus === 'Published' ? 'Post Published' : 'Draft Saved', `"${savedPost.title}" updated.`);
      } else {
        setPosts([savedPost, ...posts]);
        showToast(targetStatus === 'Published' ? 'Article Live' : 'Draft Created', `"${savedPost.title}" created.`);
      }
      
      setEditingPost(null);
      setCurrentPage('blog');

    } catch (error) {
      console.error('Error saving post:', error);
      showToast('Error', 'Failed to save post. Check console for details.', 'error');
    }
  };

  const handleDeletePost = async (post: any) => {
    if (!window.confirm(`Are you sure you want to delete "${post.title}"?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Error', 'Please login again', 'error');
        return;
      }

      const postId = post._id || post.id;
      if (!postId) {
        showToast('Error', 'Invalid post ID', 'error');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/blogs/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json();
        showToast('Error', errorData.error || 'Failed to delete post', 'error');
        return;
      }

      setPosts(posts.filter(p => (p._id || p.id) !== postId));
      showToast('Post Deleted', `"${post.title}" was removed.`, 'info');

    } catch (error) {
      console.error('Error deleting post:', error);
      showToast('Error', 'Failed to delete post. Check console for details.', 'error');
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={(token) => handleLoginSuccess(token)} />;
  }

  return (
    <div className="flex flex-1 min-h-screen bg-[#f8fafc]">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isLoggedIn={isLoggedIn}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentPage === 'dashboard' && (
            <DashboardView
              posts={posts}
              categories={categories}
              activityLogs={activityLogs}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'blog' && (
            <BlogListView
              posts={posts}
              categories={categories}
              onNavigate={handleNavigate}
              onEditPost={(post) => {
                setEditingPost(post);
                setCurrentPage('blog-edit');
              }}
              onDeletePost={handleDeletePost}
            />
          )}
          {(currentPage === 'blog-create' || currentPage === 'blog-edit') && (
            <BlogFormView
              initialPost={editingPost}
              categories={categories}
              onSave={handleSavePost}
              onCancel={() => setCurrentPage('blog')}
            />
          )}
          {currentPage === 'categories' && (
            <CategoriesView
              categories={categories}
              onAddCategory={handleAddCategory}
              onEditCategory={() => {}}
              onDeleteCategory={() => {}}
            />
          )}
          {currentPage === 'seo' && (
            <SeoSettingsView
              seoConfig={{
                sitemapUrl: 'https://shiptrack.com/sitemap.xml',
                sitemapLastGenerated: '',
                robotsTxt: 'User-agent: *\nAllow: /',
                robotsLastUpdated: '',
                metaTitleSuffix: '| ShipTrack',
                canonicalEnabled: true,
                globalMetaDescription: 'ShipTrack CMS'
              }}
              onUpdateSeoConfig={() => {}}
              onShowToast={() => {}}
            />
          )}
        </main>
      </div>
    </div>
  );
}