import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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
import { Team } from './pages/Team';
import { Register } from './pages/Register';
import { DevisGenerator } from './pages/DevisGenerator';
import { NotFound } from './pages/NotFound';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BackToTop } from './components/BackToTop';
import { CookieConsent } from './components/CookieConsent';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useAnalytics();

  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <ChatButton />
      <BackToTop />
      <CookieConsent />
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
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/devis"
            element={
              <ProtectedRoute>
                <DevisGenerator />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}