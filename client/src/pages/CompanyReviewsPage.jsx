import React, { useState } from 'react';
import { Search, Star, Building2, MapPin, Users, Briefcase, IndianRupee, MessageSquare, ChevronRight } from 'lucide-react';

const POPULAR_COMPANIES_DATA = [
  {
    id: 'c1',
    name: 'Apex Infotech India',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    rating: 4.4,
    reviewsCount: 1280,
    industry: 'Technology & IT Services',
    location: 'Bhubaneswar, Odisha',
    openJobsCount: 12,
    avgSalary: '₹6.5L - ₹16.0L /yr',
    description: 'Leading IT cloud solutions and software development company based in Infovalley, Bhubaneswar.'
  },
  {
    id: 'c2',
    name: 'CloudCraft Solutions',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 2450,
    industry: 'Cloud Infrastructure & SaaS',
    location: 'Bengaluru, Karnataka',
    openJobsCount: 18,
    avgSalary: '₹12.0L - ₹24.0L /yr',
    description: 'High-growth cloud engineering SaaS startup managing global enterprise infrastructure.'
  },
  {
    id: 'c3',
    name: 'State Bank of India (SBI)',
    logo: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=150&auto=format&fit=crop&q=80',
    rating: 4.3,
    reviewsCount: 15420,
    industry: 'Public Sector Banking',
    location: 'Pan India / Bhubaneswar',
    openJobsCount: 25,
    avgSalary: '₹6.5L - ₹12.5L /yr',
    description: 'India\'s largest public sector bank offering premier career progression and banking benefits.'
  },
  {
    id: 'c4',
    name: 'ICICI Bank Ltd',
    logo: 'https://images.unsplash.com/photo-1541359927273-d76820fc45f9?w=150&auto=format&fit=crop&q=80',
    rating: 4.2,
    reviewsCount: 7373,
    industry: 'Private Banking & Financial Services',
    location: 'Mumbai / Pan India',
    openJobsCount: 15,
    avgSalary: '₹5.5L - ₹14.0L /yr',
    description: 'Leading private financial institution offering retail banking, corporate wealth, and tech roles.'
  },
  {
    id: 'c5',
    name: 'Indigo Airlines',
    logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=150&auto=format&fit=crop&q=80',
    rating: 4.1,
    reviewsCount: 506,
    industry: 'Aviation & Customer Operations',
    location: 'Gurugram / Pan India',
    openJobsCount: 8,
    avgSalary: '₹4.0L - ₹18.0L /yr',
    description: 'India\'s preferred passenger airline operating domestic and international flights.'
  },
  {
    id: 'c6',
    name: 'National Aluminium Company (NALCO)',
    logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviewsCount: 3120,
    industry: 'Mining & Metals PSU',
    location: 'Angul / Bhubaneswar, Odisha',
    openJobsCount: 10,
    avgSalary: '₹6.0L - ₹18.0L /yr',
    description: 'Navratna Central Public Sector Unit under Ministry of Mines, operating smelter & alumina refinery.'
  },
  {
    id: 'c7',
    name: 'Vishal Mega Mart',
    logo: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=150&auto=format&fit=crop&q=80',
    rating: 4.0,
    reviewsCount: 321,
    industry: 'Retail & Consumer Goods',
    location: 'Pan India',
    openJobsCount: 14,
    avgSalary: '₹2.5L - ₹6.0L /yr',
    description: 'Popular retail superstore chain providing everyday fashion, grocery, and household products.'
  },
  {
    id: 'c8',
    name: 'Steel Authority of India (SAIL)',
    logo: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=150&auto=format&fit=crop&q=80',
    rating: 4.4,
    reviewsCount: 4280,
    industry: 'Steel Manufacturing PSU',
    location: 'Rourkela, Sundargarh, Odisha',
    openJobsCount: 12,
    avgSalary: '₹5.0L - ₹16.0L /yr',
    description: 'Maharatna Central PSU operating Rourkela Steel Plant and major metallurgical units.'
  }
];

const CompanyReviewsPage = ({ onNavigate, onSelectCompany }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const filteredCompanies = POPULAR_COMPANIES_DATA.filter((comp) => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comp.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comp.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All' || comp.industry.includes(selectedIndustry);
    return matchesSearch && matchesIndustry;
  });

  return (
    <div style={{ padding: '3rem 0 5rem 0', backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        {/* Main Hero Header (Matches Indeed Screenshot) */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 3rem auto' }}>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '0.75rem',
            color: 'var(--text-main)'
          }}>
            Find great places to work
          </h1>
          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            marginBottom: '2rem'
          }}>
            Get access to millions of company reviews, ratings, salaries, and Q&A
          </p>

          {/* Search Box */}
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{
              display: 'flex',
              gap: '0.5rem',
              backgroundColor: 'var(--bg-card)',
              padding: '0.6rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
              flexWrap: 'wrap'
            }}
          >
            <div style={{
              flex: '1 1 300px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 0.85rem'
            }}>
              <Search size={22} color="var(--primary)" />
              <input
                type="text"
                placeholder="Company name or job title"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '1rem',
                  color: 'var(--text-main)'
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ padding: '0.75rem 2rem', fontWeight: 700, borderRadius: 'var(--radius-md)' }}
            >
              Find Companies
            </button>
          </form>
        </div>

        {/* Section Heading */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Popular companies</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Rated by verified employees across India
            </p>
          </div>

          {/* Industry Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['All', 'Technology', 'Banking', 'PSU', 'Retail'].map((ind) => (
              <button
                key={ind}
                type="button"
                onClick={() => setSelectedIndustry(ind)}
                className={`btn btn-sm ${selectedIndustry === ind ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: 'var(--radius-full)', padding: '0.35rem 0.95rem' }}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Companies Grid (Matches Indeed 3-column Layout in Screenshot) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              className="card card-hover"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Top Company Info */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <img
                    src={company.logo}
                    alt={company.name}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  />

                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.2rem' }}>
                      {company.name}
                    </h3>

                    {/* Star Ratings */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <div style={{ display: 'flex', color: '#F59E0B' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < Math.floor(company.rating) ? '#F59E0B' : 'none'}
                            color="#F59E0B"
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {company.rating}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                        {company.reviewsCount.toLocaleString()} reviews
                      </span>
                    </div>
                  </div>
                </div>

                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1rem',
                  lineHeight: 1.5,
                  height: '42px',
                  overflow: 'hidden'
                }}>
                  {company.description}
                </p>
              </div>

              {/* Indeed Action Links (Salaries | Questions | Open jobs) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                <button
                  onClick={() => onNavigate('jobs', { keyword: company.name })}
                  style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
                >
                  Salaries
                </button>
                <span style={{ color: 'var(--border-color)' }}>|</span>
                <button
                  onClick={() => onNavigate('jobs', { keyword: company.name })}
                  style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
                >
                  Questions
                </button>
                <span style={{ color: 'var(--border-color)' }}>|</span>
                <button
                  onClick={() => onNavigate('jobs', { keyword: company.name })}
                  style={{ color: 'var(--primary)', fontWeight: 700, background: 'none', border: 'none' }}
                >
                  Open jobs ({company.openJobsCount})
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyReviewsPage;
