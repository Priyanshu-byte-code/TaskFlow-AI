const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  description: { type: String, maxlength: [1000, 'Description cannot exceed 1000 characters'], default: '' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['todo', 'inprogress', 'inreview', 'done'],
    default: 'todo'
  },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  tag: { type: String, enum: ['Feature', 'Bug', 'Design', 'Backend', 'AI', 'DevOps'], default: 'Feature' },
  storyPoints: { type: Number, default: 1, min: 1, max: 13 },
  dueDate: { type: Date, default: null },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  comments: [commentSchema],
  aiPrioritized: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
