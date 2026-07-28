const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true },
    companyName: { type: String, required: true },
    companyLogo: { type: String, default: '' },
    category: { type: String, required: true },
    location: { type: String, required: true },
    state: { type: String, default: 'Karnataka' },
    workMode: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], default: 'On-site' },
    jobType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], default: 'Full-time' },
    experienceLevel: { type: String, enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'], default: 'Mid Level' },
    minSalary: { type: Number, default: 0 },
    maxSalary: { type: Number, default: 0 },
    salaryCurrency: { type: String, default: 'INR' },
    salaryPeriod: { type: String, enum: ['Hourly', 'Monthly', 'Yearly'], default: 'Yearly' },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['Active', 'Closed', 'Draft'], default: 'Active' },
    viewsCount: { type: Number, default: 0 },
    applicantsCount: { type: Number, default: 0 },
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    benefits: [{ type: String }],
    skills: [{ type: String }],
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Job || mongoose.model('Job', jobSchema);
