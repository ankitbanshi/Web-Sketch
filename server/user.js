const users = [];

// Join user to chat
const userJoin = (id, username, room, host, presenter) => {
  const user = { id, username, room, host, presenter };
  users.push(user);
  return user;
};

// User leaves chat
const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// Get current user by socket id
const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

// Get all users in a room
const getUsers = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = {
  userJoin,
  userLeave,
  getUsers,
  getCurrentUser
};