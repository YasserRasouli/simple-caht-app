const users = [];

const addUser = (userId, username, room) => {
    const user = {userId, username, room};
    users.push(user);
    return user;
};

const removeUser = (id) => {
    const index = users.findIndex(u => u.userId === id);

    if (index !== -1){
        return users.splice(index,1)[0];
    }
};

const getUsersOfRoom = (room) => {
    return users.filter(u => u.room === room);
};

const getUser = (id) => {
    return users.find(u => u.userId === id);

    
};

module.exports = {
    addUser,
    getUser,
    removeUser,
    getUsersOfRoom
};