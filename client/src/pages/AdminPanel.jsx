import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import {
  ShieldCheck,
  Users,
  Building2,
  Briefcase,
  FileText,
  CheckCircle,
  XCircle,
  Trash2,
  PlusCircle,
  Layers
} from 'lucide-react';

const AdminPanel = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [catMsg, setCatMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    if (!token) return;
    try {
      const statsData = await apiFetch('/admin/stats', { token });
      setStats(statsData);

      const usersData = await apiFetch('/admin/users', { token });
      setUsersList(usersData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    try {
      await apiFetch(`/admin/users/${userId}`, { method: 'DELETE', token });
      fetchAdminData();
    } catch (err) {
      alert('Failed to remove user');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName) return;
    try {
      await apiFetch('/admin/categories', {
        method: 'POST',
        token,
        body: JSON.stringify({ name: newCatName })
      });
      setCatMsg(`Category "${newCatName}" created successfully!`);
      setNewCatName('');
      fetchAdminData();
    } catch (err) {
      setCatMsg('Failed to create category');
    }
  };

  return (
    <div style={{ padding: '2.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <ShieldCheck size={32} color="var(--primary)" />
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Platform Administration Panel</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage platform users, employers, job posts & system categories</p>
          </div>
        </div>

        {/* Metrics Overview Cards */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Users</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{stats.totalUsers}</div>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Job Seekers</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981' }}>{stats.totalSeekers}</div>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered Employers</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#8B5CF6' }}>{stats.totalEmployers}</div>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Job Posts</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F59E0B' }}>{stats.activeJobs}</div>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Applications</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#EC4899' }}>{stats.totalApplications}</div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
          {/* Main User Table */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="var(--primary)" /> Registered System Users
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Name</th>
                    <th style={{ padding: '0.75rem' }}>Email</th>
                    <th style={{ padding: '0.75rem' }}>Role</th>
                    <th style={{ padding: '0.75rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${u.role === 'admin' ? 'badge-purple' : u.role === 'employer' ? 'badge-green' : 'badge-blue'}`} style={{ textTransform: 'capitalize' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {u.role !== 'admin' && (
                          <button onClick={() => handleDeleteUser(u._id)} className="btn btn-outline btn-sm" style={{ color: '#EF4444' }}>
                            <Trash2 size={14} /> Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Sidebar: Category Creator */}
          <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="var(--primary)" /> Category Creator
            </h3>

            {catMsg && (
              <div style={{ fontSize: '0.85rem', color: '#10B981', marginBottom: '0.75rem' }}>{catMsg}</div>
            )}

            <form onSubmit={handleCreateCategory}>
              <div className="input-group">
                <label className="input-label">New Category Name</label>
                <input
                  type="text"
                  className="input-control"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Clean Energy & Trades"
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <PlusCircle size={16} /> Add Category
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
