const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { handleRoomEvents } = require("./controllers/roomController");
const { handleDrawingEvents } = require("./controllers/drawingController");
const { handleChatEvents } = require("./controllers/chatController");
const configureCors = require("./middleware/corsMiddleware");

require("dotenv").config();

const app = express();
app.use(configureCors);

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log(`🔗 User Connected: ${socket.id}`);

  handleRoomEvents(io, socket);
  handleDrawingEvents(io, socket);
  handleChatEvents(io, socket);

  socket.on("disconnect", () => console.log(`❌ User Disconnected: ${socket.id}`));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
