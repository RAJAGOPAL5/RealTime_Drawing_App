// Handles synchronizing canvas data across all users in a room.

const { redisPublisher, redisSubscriber, redisClient } = require("../config/redisClient");

const handleDrawingEvents = (io, socket) => {
  // Handle drawing event with color & brush size
  socket.on("drawing", async (room, data) => {
    const { x, y, color, size } = data;
    const strokeData = { x, y, color, size };

    // Save latest strokes to Redis (for reconnects)
    let strokes = await redisClient.get(`drawing:${room}`);
    strokes = strokes ? JSON.parse(strokes) : [];
    strokes.push(strokeData);
    await redisClient.set(`drawing:${room}`, JSON.stringify(strokes));

    // Publish event to all users
    await redisPublisher.publish(`draw:${room}`, JSON.stringify(strokeData));
  });

  // Redis subscriber listens for draw events
  redisSubscriber.subscribe("draw:*", (message, channel) => {
    const room = channel.split(":")[1];
    const data = JSON.parse(message);
    io.to(room).emit("drawing", data);
  });

  // Handle Reset Canvas Event
  socket.on("resetCanvas", async (room) => {
    await redisPublisher.publish(`reset:${room}`, "clear");
  });

  // Listen for Reset Canvas Broadcast
  redisSubscriber.subscribe("reset:*", (message, channel) => {
    const room = channel.split(":")[1];
    io.to(room).emit("resetCanvas");
  });

  // Handle user reconnection (load previous strokes)
  socket.on("reconnect", async (room) => {
    const data = await redisClient.get(`drawing:${room}`);
    if (data) {
      socket.emit("loadDrawing", JSON.parse(data));
    }
  });
};

module.exports = { handleDrawingEvents };
