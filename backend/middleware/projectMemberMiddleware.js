const Project = require('../models/Project');

// For routes where projectId comes from req.body.project or req.params.projectId
const isProjectMember = async (req, res, next) => {
  try {
    const projectId =
      req.body.project ||
      req.params.projectId ||
      req.body.projectId;

    if (!projectId) return next();

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isMember = project.members.some(
      m => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: 'Access denied. You are not a member of this project.'
      });
    }

    req.project = project;
    next();
  } catch (err) {
    next(err);
  }
};

// For task routes where we need to find the project via the task
const isTaskProjectMember = async (req, res, next) => {
  try {
    const Task = require('../models/Task');
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isMember = project.members.some(
      m => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: 'Access denied. You are not a member of this project.'
      });
    }

    req.project = project;
    req.task = task;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { isProjectMember, isTaskProjectMember };