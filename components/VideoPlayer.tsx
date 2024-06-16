'use client';

// components/ThreeSixtyVideoPlayer.tsx
import React, { useEffect, useRef } from 'react';
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

const ThreeSixtyVideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

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
  }, []);

  // Step 2: Add Event Handlers
  const handlePlay = () => {
    videoRef.current?.play();
    console.log('play button');
  };

  const handlePause = () => {
    videoRef.current?.pause();
    console.log('pause button');
  };

  return (
    <div className="relative h-screen w-screen">
      <a-scene className='w-full h-screen'>
        <a-videosphere src="#video360" rotation="0 -90 0"></a-videosphere>
        <a-entity camera look-controls wasd-controls position="0 1.6 0"></a-entity>

        <video ref={videoRef} id="video360" className='h-full w-full' crossOrigin="anonymous">
          <source src="https://pchen66.github.io/Panolens/examples/asset/textures/video/ClashofClans.mp4" type='video/mp4' />
        </video>
      </a-scene>
      {/* controls */}
      <div className="absolute top-4 right-4 flex gap-4 items-center justify-center">
        <button onClick={handlePlay} className="px-4 py-2 text-center bg-blue-400 hover:bg-blue-300 rounded transition-colors text-white">Play</button>
        <button onClick={handlePause} className="px-4 py-2 text-center bg-blue-400 hover:bg-blue-300 rounded transition-colors text-white">Pause</button>
      </div>
    </div>
  );
};

export default ThreeSixtyVideoPlayer;