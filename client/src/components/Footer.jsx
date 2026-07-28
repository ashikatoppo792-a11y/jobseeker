import React from 'react';
import { Briefcase, Heart, Mail, Phone, MapPin, Globe } from 'lucide-react';

const Footer = ({ onNavigate }) => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-card)',
      borderTop: '1px solid var(--border-color)',
      paddingTop: '3.5rem',
      paddingBottom: '2rem',
      marginTop: '4rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Briefcase size={18} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800 }}>
                Job<span style={{ color: 'var(--primary)' }}>Seeker</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Empowering candidates and recruiters across India by connecting top Indian talent with verified employers nationwide.
            </p>
            <div style={{ display: 'flex', gap: '0.85rem', color: 'var(--text-muted)' }}>
              <a href="#" style={{ color: 'inherit' }}><i className="fab fa-facebook-f"></i></a>
              <a href="#" style={{ color: 'inherit' }}><i className="fab fa-twitter"></i></a>
              <a href="#" style={{ color: 'inherit' }}><i className="fab fa-linkedin-in"></i></a>
              <a href="#" style={{ color: 'inherit' }}><i className="fab fa-instagram"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--text-main)' }}>For Job Seekers</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('jobs'); }}>Pan India Jobs</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('jobs'); }}>IT & Software Jobs</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('seeker-dashboard'); }}>Upload Resume</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('seeker-dashboard'); }}>AI Job Matcher</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('jobs'); }}>Remote India Jobs</a></li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--text-main)' }}>For Employers</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('employer-dashboard'); }}>Post a Job in India</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('employer-dashboard'); }}>Employer Dashboard</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('employer-dashboard'); }}>Applicant Tracking (ATS)</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('employer-dashboard'); }}>Company Verification</a></li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--text-main)' }}>Pan India Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--primary)" /> Indiranagar Tech Park, Bengaluru, India
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--primary)" /> +91 (80) 5555-JOBSEEK
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--primary)" /> support@jobseeker.co.in
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          gap: '1rem'
        }}>
          <div>
            © {new Date().getFullYear()} Pan India Job Portal Inc. Inspired by Indeed. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Terms of Service</a>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
