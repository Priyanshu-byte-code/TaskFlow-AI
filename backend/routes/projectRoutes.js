const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  addMember,
  deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const Project = require('../models/Project');

router.use(protect);

// Middleware: check user is member of this specific project
const checkProjectMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const isMember = project.members.some(m => m.user.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ message: 'You are not a member of this project' });
    req.project = project;
    next();
  } catch (err) { next(err); }
};

// Get only projects where user is a member — already filtered in controller
router.get('/', getProjects);

// Create project — any logged in user can create their own project
router.post('/', createProject);

// Get single project — only if member
router.get('/:id', checkProjectMember, getProject);

// Update project — only Admin or Manager who is a member
router.put('/:id', checkProjectMember, authorize('Admin', 'Manager'), updateProject);

// Add member — only Admin or Manager who is a member
router.post('/:id/members', checkProjectMember, authorize('Admin', 'Manager'), addMember);

// Delete project — only Admin who is a member
router.delete('/:id', checkProjectMember, authorize('Admin'), deleteProject);

module.exports = router;