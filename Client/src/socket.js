//  Now, the frontend can connect to the WebSocket backend.




import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your server URL

export default socket;
