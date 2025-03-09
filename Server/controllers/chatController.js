// Handles sending and receiving messages in the room chat.

const handleChatEvents = (io, socket) => {
    socket.on("sendMessage", (room, message) => {
      io.to(room).emit("chatMessage", message);
    });
  };
  
  module.exports = { handleChatEvents };
  