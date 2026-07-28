import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('jobseeker_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('jobseeker_token') || null;
  });
  const [savedJobs, setSavedJobs] = useState(() => {
    const saved = localStorage.getItem('jobseeker_saved_jobs');
    return saved ? JSON.parse(saved) : ['j1', 'j3'];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('jobseeker_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('jobseeker_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('jobseeker_token', token);
    } else {
      localStorage.removeItem('jobseeker_token');
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('jobseeker_saved_jobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    if (userData.savedJobs) {
      setSavedJobs(userData.savedJobs);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jobseeker_user');
    localStorage.removeItem('jobseeker_token');
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      if (prev.includes(jobId)) {
        return prev.filter(id => id !== jobId);
      } else {
        return [...prev, jobId];
      }
    });
  };

  const updateUser = (updatedFields) => {
    setUser(prev => ({ ...prev, ...updatedFields }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        savedJobs,
        login,
        logout,
        toggleSaveJob,
        updateUser,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
