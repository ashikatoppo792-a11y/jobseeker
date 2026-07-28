import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import JobListingsPage from './pages/JobListingsPage';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminPanel from './pages/AdminPanel';
import CompanyProfilePage from './pages/CompanyProfilePage';
import JobDetailsModal from './components/JobDetailsModal';
import ApplyModal from './components/ApplyModal';
import AuthModal from './components/AuthModal';
import AiAssistantWidget from './components/AiAssistantWidget';

const AppContent = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedEmployerId, setSelectedEmployerId] = useState(null);

  // Modals state
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' });
  const [searchFilters, setSearchFilters] = useState({});

  const handleNavigate = (page, filters = {}) => {
    setCurrentPage(page);
    setSearchFilters(filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCompanyProfile = (employerId) => {
    setSelectedEmployerId(employerId);
    setCurrentPage('company-profile');
  };

  const handleApplyClick = (job) => {
    if (!user) {
      setAuthModal({ open: true, mode: 'login' });
      return;
    }
    setApplyJob(job);
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
      />

      {/* Main Pages router */}
      <main className="main-content">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectJob={(job) => setSelectedJob(job)}
            onApplyJob={handleApplyClick}
          />
        )}

        {currentPage === 'jobs' && (
          <JobListingsPage
            initialFilters={searchFilters}
            onApplyJob={handleApplyClick}
            onOpenCompanyProfile={handleOpenCompanyProfile}
          />
        )}

        {currentPage === 'seeker-dashboard' && (
          <JobSeekerDashboard
            onSelectJob={(job) => setSelectedJob(job)}
            onApplyJob={handleApplyClick}
          />
        )}

        {currentPage === 'employer-dashboard' && (
          <EmployerDashboard />
        )}

        {currentPage === 'admin-panel' && (
          <AdminPanel />
        )}

        {currentPage === 'company-profile' && (
          <CompanyProfilePage
            employerId={selectedEmployerId}
            onBack={() => setCurrentPage('jobs')}
            onSelectJob={(job) => setSelectedJob(job)}
            onApplyJob={handleApplyClick}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating AI Assistant Widget with Mood Personalities */}
      <AiAssistantWidget />

      {/* Modals */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={handleApplyClick}
          onOpenCompanyProfile={handleOpenCompanyProfile}
        />
      )}

      {applyJob && (
        <ApplyModal
          job={applyJob}
          onClose={() => setApplyJob(null)}
          onSuccess={() => {
            if (user?.role === 'seeker') {
              setCurrentPage('seeker-dashboard');
            }
          }}
        />
      )}

      {authModal.open && (
        <AuthModal
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ open: false, mode: 'login' })}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
