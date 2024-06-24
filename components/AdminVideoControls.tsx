'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Define the type of the events your socket will handle
interface videoEvent {
  message: (data: string) => void;
  action: (data: string) => void;
  'video-path': (data: string) => void;
  // add other event types from the server here
}

export default function AdminVideoControls({ url }: { url: string; }) {


  const [socket, setSocket] = useState<Socket<videoEvent> | null>(null);
  const [file, setFile] = useState<File | null>(null);

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
  const handleSendFile = async () => {
    // if (file !== null && socket !== null) {
    //   const newVideoPath = `${url}/${file.name}`;
    //   socket.emit('video-path', newVideoPath);
    // }
    // ! old code above
    if (socket && file) {
      const formData = new FormData();
      formData.append('video', file as File);


      const response = await fetch('https://localhost:3000/upload-video', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        alert('la xuxa de la wea no anduvo weon');
      } else {
        const responseJson = await response.json();
        console.log('response: ', responseJson.file);
        alert('se subio el video');
        const newVideoPath = `${url}/${responseJson.file}`;
        socket.emit('video-path', newVideoPath);
      }
    }

  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };


  return (
    <div className="py-8 text-center w-full px-8 container mx-auto">
      <div className="mb-3">
        <label
          htmlFor="formFile"
          className="text-xl mb-2 inline-block text-neutral-500 dark:text-neutral-400"
        >
          Cargar video
        </label>
        <input
          className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-secondary-500 bg-transparent bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-surface transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:me-3 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-e file:border-solid file:border-inherit file:bg-transparent file:px-3  file:py-[0.32rem] file:text-surface focus:border-primary focus:text-gray-700 focus:shadow-inset focus:outline-none dark:border-white/70 dark:text-white  file:dark:text-white"
          onInput={handleFileChange}
          type="file"
          name='video'
          id="formFile" />

        <button
          className='bg-blue-400 px-4 py-2 rounded mx-auto my-4 disabled:bg-slate-500 disabled:cursor-not-allowed' onClick={handleSendFile}
          disabled={file === null}
        >
          Enviar
        </button>
      </div>

      <h2 className="my-4 text-neutral-500 dark:text-neutral-400 text-center text-xl">Controles del vídeo</h2>
      <div className="flex gap-4 items-center justify-center">
        <button className='bg-blue-400 px-4 py-2 rounded' onClick={handlePlay}>Play</button>
        <button className='bg-blue-400 px-4 py-2 rounded' onClick={handlePause}>Pause</button>
        <button className='bg-blue-400 px-4 py-2 rounded' onClick={handleStop}>Stop</button>
        {/* <p>Barrita del video</p> */}
      </div>
    </div>
  );
}