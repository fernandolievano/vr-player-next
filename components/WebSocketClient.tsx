'use client';

import { AppContext } from '@/context/AppContext';
import { useContext, useEffect } from 'react';
import io from 'socket.io-client';

const WebSocketClient = () => {
  const context = useContext(AppContext)
  const URL = context.currentUrl

  useEffect(() => {
    const socket = io(URL, {
      secure: true,
      rejectUnauthorized: false, // This is needed for self-signed certificates
    });

    socket.on('connect', () => {
      console.log('Connected to the server from "WebSocketClient"via socket.io');
    });

    socket.on('message', (msg: string) => {
      console.log('Message received at "WebSocketClient" from server:', msg);
    });
    socket.on('action', (msg: string) => {
      console.log('Action received at "WebSocketClient" from server:', msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className='absolute top-0 left-0 px-4 pt-4 bg-transparent text-white'>
      <h1 className='text-xl font-bold'>Socket.IO with Next.js</h1>
    </div>
  );
};

export default WebSocketClient;