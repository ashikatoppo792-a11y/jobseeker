const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['seeker', 'employer', 'admin'], default: 'seeker' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    bio: { type: String, default: '' },
    title: { type: String, default: '' },
    skills: [{ type: String }],
    experienceLevel: { type: String, default: 'Mid Level' },
    resumeUrl: { type: String, default: '' },
    resumeName: { type: String, default: '' },
    savedJobs: [{ type: String }],
    employerProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer' }
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
