import React, { useState, useEffect } from 'react';
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
import GoalSelectionModal from './components/GoalSelectionModal';
import AiAssistantWidget from './components/AiAssistantWidget';

const AppContent = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedEmployerId, setSelectedEmployerId] = useState(null);

  // Modals state
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' });
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({});

  // Auto trigger Goal Modal on first visit if not logged in
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('jobseeker_goal_selected');
    if (!hasVisited && !user) {
      const timer = setTimeout(() => {
        setGoalModalOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user]);

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

  const handleSelectGoal = (goal) => {
    sessionStorage.setItem('jobseeker_goal_selected', goal);
    if (goal === 'seeker') {
      handleNavigate('jobs');
    } else if (goal === 'employer') {
      if (user?.role === 'employer') {
        handleNavigate('employer-dashboard');
      } else {
        setAuthModal({ open: true, mode: 'register' });
      }
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
        onOpenGoalModal={() => setGoalModalOpen(true)}
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

      {/* Goal Selection Modal ("What do you want to do?") */}
      <GoalSelectionModal
        isOpen={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        onSelectGoal={handleSelectGoal}
      />

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={handleApplyClick}
          onOpenCompanyProfile={handleOpenCompanyProfile}
        />
      )}

      {/* Application Submission Modal */}
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

      {/* Auth Login/Register Modal */}
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
