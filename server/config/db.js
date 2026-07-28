const mongoose = require('mongoose');

// In-Memory fallback store with Pan India & Odisha jobs from Thousands/month to Lakhs/year
const memoryStore = {
  users: [
    {
      _id: 'u1',
      name: 'Rohan Sharma',
      email: 'seeker@example.com',
      password: '$2a$10$X7vQ4JgBqZ7mE4L1xK9y0.5n2D7f5s8g2h1j3k4l5m6n7o8p9q0r1',
      role: 'seeker',
      phone: '+91 98765 43210',
      location: 'Bhubaneswar',
      state: 'Odisha',
      bio: 'Full Stack Software Engineer with 4 years experience in React & Node.js in Odisha.',
      title: 'Senior Full Stack Engineer',
      skills: ['React', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'CSS3', 'REST API'],
      experienceLevel: 'Mid Level',
      resumeUrl: '/uploads/resumes/sample_resume_rohan.pdf',
      resumeName: 'Rohan_Sharma_Resume_2026.pdf',
      savedJobs: ['j1', 'j6', 'j10'],
      createdAt: new Date('2026-01-15T09:00:00Z')
    },
    {
      _id: 'u2',
      name: 'Priya Mehta',
      email: 'employer@techcorp.com',
      password: '$2a$10$X7vQ4JgBqZ7mE4L1xK9y0.5n2D7f5s8g2h1j3k4l5m6n7o8p9q0r1',
      role: 'employer',
      employerProfile: 'e1',
      phone: '+91 98123 45678',
      location: 'Bhubaneswar',
      state: 'Odisha',
      createdAt: new Date('2026-01-10T10:00:00Z')
    },
    {
      _id: 'u3',
      name: 'Pan India Admin',
      email: 'admin@jobseeker.com',
      password: '$2a$10$X7vQ4JgBqZ7mE4L1xK9y0.5n2D7f5s8g2h1j3k4l5m6n7o8p9q0r1',
      role: 'admin',
      phone: '+91 674 1111 2222',
      location: 'Bhubaneswar',
      state: 'Odisha',
      createdAt: new Date('2026-01-01T08:00:00Z')
    }
  ],
  employers: [
    {
      _id: 'e1',
      userId: 'u2',
      companyName: 'Apex Infotech India',
      tagline: 'Leading IT & Digital Solutions across Odisha & Pan India',
      website: 'https://apexinfotech.co.in',
      industry: 'Technology & Software',
      companySize: '500-1000 employees',
      headquarters: 'Khordha (Bhubaneswar HQ), Odisha',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      description: 'Apex Infotech is a top-tier software company operating across Bhubaneswar, Cuttack, Rourkela, and Bengaluru.',
      verified: true,
      rating: 4.8,
      reviewCount: 42,
      createdAt: new Date('2026-01-10T10:00:00Z')
    },
    {
      _id: 'e2',
      userId: 'u5',
      companyName: 'Kalinga Healthcare & Medical',
      tagline: 'Premier clinical care across Odisha',
      website: 'https://kalingahealthcare.co.in',
      industry: 'Healthcare & Medical',
      companySize: '1000-5000 employees',
      headquarters: 'Cuttack, Odisha',
      logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=150&auto=format&fit=crop&q=80',
      description: 'Super-specialty healthcare system serving Khordha, Cuttack, Ganjam, and Sundargarh districts.',
      verified: true,
      rating: 4.7,
      reviewCount: 55,
      createdAt: new Date('2026-01-12T14:00:00Z')
    },
    {
      _id: 'e3',
      userId: 'u6',
      companyName: 'Utkal Minerals & Industrial Logistics',
      tagline: 'Industrial manufacturing & logistics in Odisha',
      website: 'https://utkalminerals.co.in',
      industry: 'Engineering & Manufacturing',
      companySize: '2000-5000 employees',
      headquarters: 'Sundargarh (Rourkela HQ), Odisha',
      logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80',
      description: 'Industrial heavyweight managing manufacturing and logistics hubs in Rourkela, Jharsuguda, and Angul.',
      verified: true,
      rating: 4.5,
      reviewCount: 38,
      createdAt: new Date('2026-01-20T09:15:00Z')
    }
  ],
  categories: [
    { _id: 'cat1', name: 'Technology & IT', icon: 'fa-laptop-code', jobCount: 45, color: '#3B82F6' },
    { _id: 'cat2', name: 'Healthcare & Medical', icon: 'fa-user-nurse', jobCount: 32, color: '#10B981' },
    { _id: 'cat3', name: 'Customer Service & BPO', icon: 'fa-headset', jobCount: 42, color: '#F59E0B' },
    { _id: 'cat4', name: 'Engineering & Manufacturing', icon: 'fa-hard-hat', jobCount: 35, color: '#6366F1' },
    { _id: 'cat5', name: 'Marketing & Digital', icon: 'fa-bullhorn', jobCount: 24, color: '#EC4899' },
    { _id: 'cat6', name: 'Hospitality & Retail', icon: 'fa-store', jobCount: 30, color: '#EF4444' }
  ],
  jobs: [
    // LAKHS (LPA) JOBS
    {
      _id: 'j6',
      title: 'Senior Full Stack Software Engineer',
      employerId: 'e1',
      companyName: 'Apex Infotech India',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      category: 'Technology & IT',
      location: 'Khordha (Bhubaneswar HQ), Odisha',
      state: 'Odisha',
      district: 'Khordha (Bhubaneswar HQ)',
      workMode: 'Hybrid',
      jobType: 'Full-time',
      experienceLevel: 'Mid Level',
      minSalary: 1000000,
      maxSalary: 1600000,
      salaryCurrency: 'INR',
      salaryPeriod: 'Yearly',
      featured: true,
      status: 'Active',
      viewsCount: 480,
      applicantsCount: 29,
      description: 'Join Infovalley Bhubaneswar IT Hub! Apex Infotech is hiring Senior Full Stack React & Node.js Developers for enterprise cloud software.',
      responsibilities: [
        'Build frontend web portals using React',
        'Deploy microservices in Node.js & Express'
      ],
      requirements: ['3+ years React & Node.js experience'],
      benefits: ['Pay: ₹10 - 16 LPA', 'Health Cover', 'WFH 2 days/week'],
      skills: ['React', 'Node.js', 'JavaScript', 'MongoDB'],
      createdAt: new Date('2026-02-18T08:00:00Z')
    },
    {
      _id: 'j7',
      title: 'Plant Operations & Metallurgical Lead',
      employerId: 'e3',
      companyName: 'Utkal Minerals & Industrial Logistics',
      companyLogo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80',
      category: 'Engineering & Manufacturing',
      location: 'Sundargarh (Rourkela HQ), Odisha',
      state: 'Odisha',
      district: 'Sundargarh (Rourkela HQ)',
      workMode: 'On-site',
      jobType: 'Full-time',
      experienceLevel: 'Senior Level',
      minSalary: 900000,
      maxSalary: 1500000,
      salaryCurrency: 'INR',
      salaryPeriod: 'Yearly',
      featured: true,
      status: 'Active',
      viewsCount: 310,
      applicantsCount: 16,
      description: 'Hiring Operations Lead at Rourkela Steel plant to manage production and plant assembly lines.',
      responsibilities: ['Manage industrial production and safety logs'],
      requirements: ['B.Tech Metallurgy / Mechanical'],
      benefits: ['Pay: ₹9 - 15 LPA + Quarters'],
      skills: ['Manufacturing', 'Operations', 'Metallurgy'],
      createdAt: new Date('2026-02-16T10:00:00Z')
    },

    // THOUSANDS / MONTH JOBS
    {
      _id: 'j10',
      title: 'Customer Service & Helpdesk Specialist',
      employerId: 'e1',
      companyName: 'Apex Infotech India',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      category: 'Customer Service & BPO',
      location: 'Khordha (Bhubaneswar HQ), Odisha',
      state: 'Odisha',
      district: 'Khordha (Bhubaneswar HQ)',
      workMode: 'On-site',
      jobType: 'Full-time',
      experienceLevel: 'Entry Level',
      minSalary: 18000,
      maxSalary: 32000,
      salaryCurrency: 'INR',
      salaryPeriod: 'Monthly',
      featured: true,
      status: 'Active',
      viewsCount: 520,
      applicantsCount: 42,
      description: 'Hiring Customer Support Specialists in Bhubaneswar for inbound customer query handling and ticket resolution.',
      responsibilities: [
        'Answer customer phone calls and email queries in English & Odia',
        'Log support tickets in CRM'
      ],
      requirements: ['Graduate / 10+2 with good communication skills'],
      benefits: ['Pay: ₹18,000 - ₹32,000 /month', 'Paid Overtime', 'ESI & PF'],
      skills: ['Customer Support', 'Communication', 'CRM', 'Helpdesk'],
      createdAt: new Date('2026-02-19T09:00:00Z')
    },
    {
      _id: 'j11',
      title: 'Junior Web Developer Trainee',
      employerId: 'e1',
      companyName: 'Apex Infotech India',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      category: 'Technology & IT',
      location: 'Cuttack, Odisha',
      state: 'Odisha',
      district: 'Cuttack',
      workMode: 'On-site',
      jobType: 'Full-time',
      experienceLevel: 'Entry Level',
      minSalary: 25000,
      maxSalary: 45000,
      salaryCurrency: 'INR',
      salaryPeriod: 'Monthly',
      featured: false,
      status: 'Active',
      viewsCount: 610,
      applicantsCount: 50,
      description: 'Great opportunity for fresh graduates in Cuttack! Junior React frontend trainee position with structured mentoring.',
      responsibilities: [
        'Assist senior developers in coding React components',
        'Fix UI bugs and update web layouts'
      ],
      requirements: ['Basic knowledge of HTML, CSS, JavaScript, React'],
      benefits: ['Pay: ₹25,000 - ₹45,000 /month', 'Performance incentives'],
      skills: ['HTML', 'CSS', 'JavaScript', 'React'],
      createdAt: new Date('2026-02-20T11:30:00Z')
    },
    {
      _id: 'j12',
      title: 'Retail Store & Sales Supervisor',
      employerId: 'e2',
      companyName: 'Kalinga Healthcare & Retail',
      companyLogo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=150&auto=format&fit=crop&q=80',
      category: 'Hospitality & Retail',
      location: 'Puri, Odisha',
      state: 'Odisha',
      district: 'Puri',
      workMode: 'On-site',
      jobType: 'Full-time',
      experienceLevel: 'Entry Level',
      minSalary: 16000,
      maxSalary: 28000,
      salaryCurrency: 'INR',
      salaryPeriod: 'Monthly',
      featured: false,
      status: 'Active',
      viewsCount: 280,
      applicantsCount: 22,
      description: 'Hiring Retail & Store Supervisor in Puri for managing store inventory, customer billing, and daily sales counter.',
      responsibilities: [
        'Manage store inventory and stock registers',
        'Assist customers with billing and product inquiries'
      ],
      requirements: ['12th pass / Diploma in Retail'],
      benefits: ['Pay: ₹16,000 - ₹28,000 /month + sales incentive'],
      skills: ['Retail Sales', 'Customer Service', 'Inventory', 'Billing'],
      createdAt: new Date('2026-02-21T14:00:00Z')
    },
    {
      _id: 'j8',
      title: 'Senior ICU Clinical Nurse',
      employerId: 'e2',
      companyName: 'Kalinga Healthcare & Medical',
      companyLogo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=150&auto=format&fit=crop&q=80',
      category: 'Healthcare & Medical',
      location: 'Cuttack, Odisha',
      state: 'Odisha',
      district: 'Cuttack',
      workMode: 'On-site',
      jobType: 'Full-time',
      experienceLevel: 'Mid Level',
      minSalary: 45000,
      maxSalary: 75000,
      salaryCurrency: 'INR',
      salaryPeriod: 'Monthly',
      featured: false,
      status: 'Active',
      viewsCount: 260,
      applicantsCount: 12,
      description: 'Kalinga Healthcare Cuttack is hiring Senior ICU Nurses for critical patient care.',
      responsibilities: ['Provide critical care in cardiac ICU unit'],
      requirements: ['B.Sc Nursing with registration'],
      benefits: ['Pay: ₹45,000 - ₹75,000 /month'],
      skills: ['Patient Care', 'ICU', 'BLS Certified'],
      createdAt: new Date('2026-02-14T09:30:00Z')
    }
  ],
  applications: [],
  reviews: [],
  notifications: []
};

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobseeker';
    const conn = await mongoose.connect(connStr, { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.log(`MongoDB Connection Notice: Utilizing Thousands to Lakhs memory fallback store`);
    return false;
  }
};

module.exports = { connectDB, memoryStore };
