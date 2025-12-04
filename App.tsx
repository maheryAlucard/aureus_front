import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAnalytics } from './hooks/useAnalytics';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatButton } from './components/ChatButton';
import { Home } from './pages/Home';
import { Solutions } from './pages/Solutions';
import { Work } from './pages/Work';
import { Contact } from './pages/Contact';
import { Pricing } from './pages/Pricing';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { ProjectDetail } from './pages/ProjectDetail';
import { SearchResults } from './pages/SearchResults';
import { AdminDashboard } from './pages/Admin';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DevisGenerator } from './pages/DevisGenerator';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BackToTop } from './components/BackToTop';
import { CookieConsent } from './components/CookieConsent';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  
  // Track analytics for non-admin pages
  if (!isAdmin) {
    useAnalytics();
  }

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
      {!isAdmin && <ChatButton />}
      {!isAdmin && <BackToTop />}
      {!isAdmin && <CookieConsent />}
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:id" element={<ProjectDetail />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/devis" 
            element={
              <ProtectedRoute>
                <DevisGenerator />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}