const Project = require('../models/Project');
const User = require('../models/User');
const Notification = require('../models/Notification');

const notifyMembers = async (io, memberIds, actorId, type, message, projectId) => {
  try {
    const recipients = memberIds.filter(id => id.toString() !== actorId.toString());
    if (recipients.length === 0) return;
    await Notification.insertMany(
      recipients.map(recipientId => ({
        recipient: recipientId,
        sender: actorId,
        type,
        message,
        project: projectId
      }))
    );
    recipients.forEach(recipientId => {
      io.to(recipientId.toString()).emit('notification:new', {
        type,
        message,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    });
  } catch (err) {
    console.error('notifyMembers error:', err.message);
  }
};

// Helper to get fully populated project
const getPopulatedProject = async (projectId) => {
  return await Project.findById(projectId)
    .populate('owner', 'name email role avatar isOnline')
    .populate('members.user', 'name email role avatar isOnline');
};

const createProject = async (req, res, next) => {
  try {
    const { name, description, sprintName, sprintStart, sprintEnd } = req.body;
    const project = await Project.create({
      name, description, sprintName, sprintStart, sprintEnd,
      owner: req.user._id,
      members: [{ user: req.user._id, role: req.user.role }]
    });
    await User.findByIdAndUpdate(req.user._id, { $push: { projects: project._id } });

    // Return fully populated so member names show immediately
    const populated = await getPopulatedProject(project._id);
    res.status(201).json(populated);
  } catch (err) { next(err); }
};

const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ 'members.user': req.user._id })
      .populate('owner', 'name email role avatar isOnline')
      .populate('members.user', 'name email role avatar isOnline');
    res.json(projects);
  } catch (err) { next(err); }
};

const getProject = async (req, res, next) => {
  try {
    const project = await getPopulatedProject(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) { next(err); }
};

const updateProject = async (req, res, next) => {
  try {
    await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    const project = await getPopulatedProject(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const memberIds = project.members.map(m => m.user._id);
    await notifyMembers(
      req.io, memberIds, req.user._id,
      'task_updated',
      `${req.user.name} updated project settings`,
      project._id
    );

    res.json(project);
  } catch (err) { next(err); }
};

const addMember = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found. They must register first.' });

    const project = await Project.findById(req.params.id);
    const alreadyMember = project.members.find(
      m => m.user.toString() === user._id.toString()
    );
    if (alreadyMember) return res.status(400).json({ message: 'User is already a member of this project' });

    project.members.push({ user: user._id, role: role || 'Member' });
    await project.save();
    await User.findByIdAndUpdate(user._id, { $push: { projects: project._id } });

    // Notify the new member
    await Notification.create({
      recipient: user._id,
      sender: req.user._id,
      type: 'task_assigned',
      message: `${req.user.name} added you to project "${project.name}" as ${role || 'Member'}`,
      project: project._id
    });
    req.io.to(user._id.toString()).emit('notification:new', {
      type: 'task_assigned',
      message: `${req.user.name} added you to project "${project.name}" as ${role || 'Member'}`,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    // Notify existing members
    const existingMemberIds = project.members
      .map(m => m.user)
      .filter(id => id.toString() !== user._id.toString());
    await notifyMembers(
      req.io, existingMemberIds, req.user._id,
      'task_updated',
      `${req.user.name} added ${user.name} to the project`,
      project._id
    );

    // Return fully populated so names show immediately without refresh
    const populated = await getPopulatedProject(project._id);
    res.json(populated);
  } catch (err) { next(err); }
};

const deleteProject = async (req, res, next) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) { next(err); }
};

module.exports = { createProject, getProjects, getProject, updateProject, addMember, deleteProject };