
import ThreeSixtyVideoPlayer from '@/components/VideoPlayer';
import os from 'os';

export default function Home() {
  // traer iP:
  const getLocalIP = () => {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
      const networkInterface = networkInterfaces[interfaceName];
      for (const networkAddress of networkInterface as any[]) {
        if (networkAddress.family === 'IPv4' && !networkAddress.internal) {
          return networkAddress.address;
        }
      }
    }
    return 'Local IP not found';
  };

  const currentIP = getLocalIP();
  const currentPort = process.env.CUSTOM_PORT;
  const currentURL = `https://${currentIP}:${currentPort}`;

  console.log('Hello from server, the url is: ', currentURL);

  return (
    <main className="w-full flex h-screen flex-col items-center justify-center p-24">
      <ThreeSixtyVideoPlayer url={currentURL} />
    </main>
  );
}
