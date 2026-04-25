const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasksByProject,
  updateTask,
  updateTaskStatus,
  addComment,
  deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const Project = require('../models/Project');
const Task = require('../models/Task');

router.use(protect);

// Middleware: check user is member of project (from body or param)
const checkProjectMember = async (req, res, next) => {
  try {
    const projectId = req.body.project || req.params.projectId;
    if (!projectId) return res.status(400).json({ message: 'Project ID required' });
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const isMember = project.members.some(m => m.user.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ message: 'You are not a member of this project' });
    req.project = project;
    next();
  } catch (err) { next(err); }
};

// Middleware: check user is member of project (from task id)
const checkTaskMember = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const isMember = project.members.some(m => m.user.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ message: 'You are not a member of this project' });
    req.project = project;
    req.task = task;
    next();
  } catch (err) { next(err); }
};

router.post('/', checkProjectMember, createTask);
router.get('/project/:projectId', checkProjectMember, getTasksByProject);
router.put('/:id', checkTaskMember, updateTask);
router.patch('/:id/status', checkTaskMember, updateTaskStatus);
router.post('/:id/comments', checkTaskMember, addComment);
router.delete('/:id', checkTaskMember, authorize('Admin', 'Manager'), deleteTask);

module.exports = router;