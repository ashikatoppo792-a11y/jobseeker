const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: String, default: 'fa-briefcase' },
    jobCount: { type: Number, default: 0 },
    color: { type: String, default: '#3B82F6' }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);
