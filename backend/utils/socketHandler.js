const User = require('../models/User');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join:user', async (userId) => {
      socket.join(userId);
      await User.findByIdAndUpdate(userId, { isOnline: true });
      io.emit('user:online', { userId });
    });

    socket.on('join:project', (projectId) => {
      socket.join(projectId);
    });

    socket.on('leave:project', (projectId) => {
      socket.leave(projectId);
    });

    socket.on('typing:comment', ({ projectId, userName }) => {
      socket.to(projectId).emit('typing:comment', { userName });
    });

    socket.on('disconnect', async () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;
