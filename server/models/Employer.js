const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    tagline: { type: String, default: '' },
    website: { type: String, default: '' },
    industry: { type: String, default: 'General' },
    companySize: { type: String, default: '1-50 employees' },
    headquarters: { type: String, default: '' },
    logo: { type: String, default: '' },
    bannerImage: { type: String, default: '' },
    description: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Employer || mongoose.model('Employer', employerSchema);
