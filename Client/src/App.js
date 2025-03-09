import React from 'react';
import DrawingApp from './DrawingApp';
import Chat from './components/chat';

function App() {
  const roomId = "exampleRoomId"; // Replace with your actual room ID logic

  return (
    <div className="App">
      <DrawingApp />
      <Chat roomId={roomId} />
    </div>
  );
}

export default App;

