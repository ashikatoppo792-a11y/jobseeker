const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    seekerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true },
    applicantName: { type: String, required: true },
    applicantEmail: { type: String, required: true },
    applicantPhone: { type: String, default: '' },
    resumeUrl: { type: String, required: true },
    resumeName: { type: String, default: 'Resume.pdf' },
    coverLetter: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Interviewing', 'Accepted', 'Rejected'],
      default: 'Pending'
    },
    appliedDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Application || mongoose.model('Application', applicationSchema);
