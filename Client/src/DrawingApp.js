import React, { useRef, useEffect } from 'react';
import socket from './socket'; // Ensure you have a socket instance set up

function DrawingApp() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Example drawing code
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Add your real-time collaborative drawing logic here
    socket.on('draw', ({ x, y }) => {
      context.fillStyle = 'black';
      context.fillRect(x, y, 2, 2);
    });

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      socket.emit('draw', { x, y });
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas ref={canvasRef} width={800} height={600} />
  );
}

export default DrawingApp;