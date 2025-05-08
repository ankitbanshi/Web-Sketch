
const users = [];


const userJoin = (id, username, room, host, presenter) => {
  const user = { id, username, room, host, presenter };
  users.push(user);
  return user;
};


const userLeave = (id) => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};


const getUsers = (room) => {
  return users.filter(user => user.room === room);
};

module.exports = { userJoin, getUsers, userLeave };

