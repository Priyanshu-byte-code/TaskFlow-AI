const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  description: { type: String, maxlength: [500, 'Description cannot exceed 500 characters'], default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['Admin', 'Manager', 'Member'], default: 'Member' }
  }],
  sprintName: { type: String, default: 'Sprint 1' },
  sprintStart: { type: Date, default: Date.now },
  sprintEnd: { type: Date, default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
  status: { type: String, enum: ['active', 'completed', 'on-hold'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
