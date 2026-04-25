const Task = require('../models/Task');
const Notification = require('../models/Notification');
const Project = require('../models/Project');

// Helper: notify all project members except the actor
const notifyProjectMembers = async (io, projectId, actorId, type, message, taskId = null) => {
  try {
    const project = await Project.findById(projectId).populate('members.user', '_id');
    if (!project) return;

    const recipients = project.members
      .map(m => m.user._id.toString())
      .filter(id => id !== actorId.toString());

    const notifications = await Notification.insertMany(
      recipients.map(recipientId => ({
        recipient: recipientId,
        sender: actorId,
        type,
        message,
        task: taskId,
        project: projectId
      }))
    );

    // Emit real-time to each recipient's socket room
    recipients.forEach(recipientId => {
      io.to(recipientId).emit('notification:new', {
        _id: notifications.find(n => n.recipient.toString() === recipientId)?._id,
        type,
        message,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    });
  } catch (err) {
    console.error('notifyProjectMembers error:', err.message);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignee, priority, tag, storyPoints, dueDate } = req.body;
    const task = await Task.create({
      title, description, project, assignee, priority, tag, storyPoints, dueDate,
      createdBy: req.user._id
    });

    const populated = await task.populate('assignee createdBy', 'name email avatar');

    // Notify all project members that a task was created
    await notifyProjectMembers(
      req.io, project, req.user._id,
      'task_updated',
      `${req.user.name} created a new task: "${title}"`,
      task._id
    );

    // Extra: notify assignee specifically if assigned to someone else
    if (assignee && assignee !== req.user._id.toString()) {
      await Notification.create({
        recipient: assignee,
        sender: req.user._id,
        type: 'task_assigned',
        message: `${req.user.name} assigned you a task: "${title}"`,
        task: task._id,
        project
      });
      req.io.to(assignee).emit('notification:new', {
        type: 'task_assigned',
        message: `${req.user.name} assigned you a task: "${title}"`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    req.io.to(project).emit('task:created', populated);
    res.status(201).json(populated);
  } catch (err) { next(err); }
};

const getTasksByProject = async (req, res, next) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) { next(err); }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    }).populate('assignee', 'name email avatar').populate('createdBy', 'name email');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    await notifyProjectMembers(
      req.io, task.project, req.user._id,
      'task_updated',
      `${req.user.name} updated task: "${task.title}"`,
      task._id
    );

    req.io.to(task.project.toString()).emit('task:updated', task);
    res.json(task);
  } catch (err) { next(err); }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    ).populate('assignee', 'name email avatar');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    const statusLabels= {
      todo: 'To do',
      inprogress: 'In progress',
      inreview: 'In review',
      done: 'Done'
    };

    await notifyProjectMembers(
      req.io, task.project, req.user._id,
      'task_updated',
      `${req.user.name} moved "${task.title}" to ${statusLabels[status] || status}`,
      task._id
    );

    req.io.to(task.project.toString()).emit('task:statusChanged', { taskId: task._id, status, task });
    res.json(task);
  } catch (err) { next(err); }
};

const addComment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.comments.push({ author: req.user._id, text: req.body.text });
    await task.save();
    await task.populate('comments.author', 'name avatar');

    await notifyProjectMembers(
      req.io, task.project, req.user._id,
      'comment_added',
      `${req.user.name} commented on "${task.title}": "${req.body.text.substring(0, 50)}${req.body.text.length > 50 ? '...' : ''}"`,
      task._id
    );

    req.io.to(task.project.toString()).emit('task:commented', { taskId: task._id, comments: task.comments });
    res.json(task.comments);
  } catch (err) { next(err); }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await notifyProjectMembers(
      req.io, task.project, req.user._id,
      'task_updated',
      `${req.user.name} deleted task: "${task.title}"`,
      null
    );

    req.io.to(task.project.toString()).emit('task:deleted', { taskId: task._id });
    res.json({ message: 'Task deleted' });
  } catch (err) { next(err); }
};

module.exports = { createTask, getTasksByProject, updateTask, updateTaskStatus, addComment, deleteTask };