// Handles user joining, leaving, and room notifications.

// const { createClient } = require("redis");
// const redisClient = createClient();
// (async () => await redisClient.connect())();

// const handleRoomEvents = (io, socket) => {
//   socket.on("joinRoom", async (room, username) => {
//     socket.join(room);
//     const message = `${username} joined ${room}`;
    
//     // Store active users in Redis (temporary)
//     await redisClient.sAdd(`room:${room}`, username);
//     io.to(room).emit("roomMessage", message);
//   });

//   socket.on("leaveRoom", async (room, username) => {
//     socket.leave(room);
//     const message = `${username} left ${room}`;
    
//     await redisClient.sRem(`room:${room}`, username);
//     io.to(room).emit("roomMessage", message);
//   });
// };

// module.exports = { handleRoomEvents };



const { redisClient } = require("../config/redisClient");

const handleRoomEvents = (io, socket) => {
  socket.on("joinRoom", async (room, username) => {
    socket.join(room);
    await redisClient.sAdd(`room:${room}`, username);
    io.to(room).emit("roomMessage", `${username} joined ${room}`);
  });

  socket.on("leaveRoom", async (room, username) => {
    socket.leave(room);
    await redisClient.sRem(`room:${room}`, username);
    io.to(room).emit("roomMessage", `${username} left ${room}`);
  });
};

module.exports = { handleRoomEvents };

