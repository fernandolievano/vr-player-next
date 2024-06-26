'use client';

// components/ThreeSixtyVideoPlayer.tsx
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import 'aframe';
import 'aframe-look-at-component';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-assets': any; // Add the missing 'a-assets' property
      'a-videosphere': any; // Add the missing 'a-videosphere' property
      'a-entity': any; // Add the missing 'a-videosphere' property
    }
  }
}

interface PropsInterface {
  url: string
}

const ThreeSixtyVideoPlayer: React.FC<PropsInterface> = (props: PropsInterface) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sourceRef = useRef<HTMLSourceElement | null>(null);
  const [showOkButton, setShowOkButton] = useState<Boolean>(true);
  const [newUrlVideo, setNewUrlVideo] = useState<string>('');
  const [isReceiving, setIsReceiving] = useState<boolean>(false);
  const URL  = props.url

  useEffect(() => {
    // Check if 'log-on-play' component is already registered
    if (!AFRAME.components['log-on-play']) {
      AFRAME.registerComponent('log-on-play', {
        init: function () {
          const videoEl = this.el;
          videoEl.addEventListener('play', () => {
            console.log('Video is playing!');
          });
        }
      });
    }

    const socket = io(URL, {
      secure: true,
      rejectUnauthorized: false, // This is needed for self-signed certificates
    });

    socket.on('message', (msg: string) => {
      console.log('Message received at "VideoPlayer" from server:', msg);
    });

    socket.on('action', (msg: string) => {
      console.log('Action received at "VideoPlayer" from server:', msg);

      switch (msg) {
        case 'play':
          handlePlay();
          break;
        case 'pause':
          handlePause();
          break;

        case 'stop':
          handleStop();
          break;

        default:
          break;
      }
    });

    socket.on('video-path', (msg: string) => {
      setIsReceiving(true);

      console.log('receiving...');
      setNewUrlVideo(msg);
      console.log('new url for video is: ', msg);

      if (videoRef.current) {
        videoRef.current.src = msg;
        videoRef.current.load();
      }

      setIsReceiving(false);
    });
  }, []);

  // Step 2: Add Event Handlers
  const handlePlay = () => {
    if (videoRef) {
      videoRef.current?.play();
      console.log('play button');
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current?.pause();
      console.log('pause button');
    }
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };
  // const handleFileChange = () => {
  //   const blob = new Blob(receivedChunks, { type: 'video/mp4' });
  //   const url = URL.createObjectURL(blob);

  //   console.log('handling file change...');

  //   if (videoRef.current && sourceRef.current) {
  //     sourceRef.current.remove();
  //     videoRef.current.src = url;
  //     videoRef.current.load()
  //   }
  // };

  return (
    <div className="relative h-screen w-screen">
      <a-scene className='w-full h-screen'>
        <a-videosphere src="#video360" rotation="0 -90 0"></a-videosphere>
        <a-entity camera look-controls wasd-controls position="0 1.6 0"></a-entity>

        <video ref={videoRef} id="video360" className='h-full w-full' crossOrigin="anonymous" src="https://pchen66.github.io/Panolens/examples/asset/textures/video/ClashofClans.mp4">
          {/* <source ref={sourceRef} src="https://pchen66.github.io/Panolens/examples/asset/textures/video/ClashofClans.mp4" type='video/mp4' /> */}
        </video>
      </a-scene>
      {/* controls */}
      <div className={`absolute w-full h-full flex items-center justify-center inset-0 mx-auto my-auto text-center bg-white bg-opacity-5 transition-all ${showOkButton ? 'block' : 'hidden'}`}>
        <button
          className={`z-50 px-4 py-2 text-center bg-blue-400 hover:bg-blue-300 rounded transition-colors text-white`}
          onClick={() => setShowOkButton(false)}
        >
          Acceder
        </button>
      </div>

      {isReceiving && <div className="absolute w-full h-full flex items-center justify-center inset-0 mx-auto my-auto text-center bg-white bg-opacity-5 transition-all z-50">
        <h1 className='text-2xl text-center text-neutral-500 py-12'>Recibiendo video...</h1>
      </div>}
    </div>
  );
};

export default ThreeSixtyVideoPlayer;