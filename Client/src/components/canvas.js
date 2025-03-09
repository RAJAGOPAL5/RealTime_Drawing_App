//  Users can draw, change brush color & size, and reset the canvas.

import React, { useEffect, useRef, useState } from "react";
import socket from "../socket";

const Canvas = ({ roomId }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    ctxRef.current = canvas.getContext("2d");

    // Listen for drawing updates
    socket.on("drawing", ({ x, y, color, size }) => {
      draw(x, y, color, size);
    });

    socket.on("resetCanvas", () => {
      ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off("drawing");
      socket.off("resetCanvas");
    };
  }, []);

  const draw = (x, y, color, size) => {
    const ctx = ctxRef.current;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    socket.emit("drawing", { roomId, x: offsetX, y: offsetY, color, size });
  };

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={600} onMouseMove={handleMouseMove} />
      <div>
        <label>Color:</label>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <label>Brush Size:</label>
        <input type="range" min="1" max="10" value={size} onChange={(e) => setSize(e.target.value)} />
      </div>
      <button onClick={() => socket.emit("resetCanvas", roomId)}>Reset Canvas</button>
    </div>
  );
};

export default Canvas;
