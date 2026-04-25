const User = require('../models/User');

const getMe = async (req, res) => res.json(req.user);

const getTeamMembers = async (req, res, next) => {
  try {
    const users = await User.find({ projects: req.params.projectId })
      .select('name email role avatar isOnline lastSeen');
    res.json(users);
  } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true, runValidators: true });
    res.json(user);
  } catch (err) { next(err); }
};

module.exports = { getMe, getTeamMembers, updateProfile };
