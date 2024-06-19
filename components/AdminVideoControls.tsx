'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Define the type of the events your socket will handle
interface videoEvent {
  message: (data: string) => void;
  action: (data: string) =>  void;
  // add other event types from the server here
}

export default function AdminVideoControls() {


  const [socket, setSocket] = useState<Socket<videoEvent> | null>(null);

  useEffect(() => {
    const newSocket = io('https://localhost:3000', {
      secure: true,
      rejectUnauthorized: false, // This is needed for self-signed certificates
    });

    newSocket.on('connect', () => {
      console.log('Connected to the server from "AdminVideoControls" via socket.io');
    });

    newSocket.on('message', (msg: string) => {
      console.log('Message received at "AdminVideoControls" from server:', msg);
    });
    newSocket.on('action', (msg: string) => {
      console.log('Action received at "AdminVideoControls" from server:', msg);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  // Define the handlers
  const handlePlay = () => {
    // socket?.emit('message', 'play');
    socket?.emit('action', 'play');
  };

  const handlePause = () => {
    // socket?.emit('message', 'pause');
    socket?.emit('action', 'pause');
  };

  const handleStop = () => {
    // socket?.emit('message', 'stop');
    socket?.emit('action', 'stop');
  };

  return (
    <div className="py-8 text-center">
      <h2 className='mb-4'>Controles del video:</h2>

      <div className="flex gap-4 items-center justify-center">
        <button className='bg-blue-400 px-4 py-2 rounded' onClick={handlePlay}>Play</button>
        <button className='bg-blue-400 px-4 py-2 rounded' onClick={handlePause}>Pause</button>
        <button className='bg-blue-400 px-4 py-2 rounded' onClick={handleStop}>Stop</button>

        <p>Barrita del video</p>
      </div>
    </div>
  );
}