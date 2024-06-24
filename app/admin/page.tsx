import AdminVideoControls from '@/components/AdminVideoControls';
import os from 'os'

// TODO: QR link
// TODO: Mini reproductor

export default function AdminPage() {

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
  const currentPort = process.env.CUSTOM_PORT
  const currentURL = `https://${currentIP}:${currentPort}`

  return (
    <div className='min-h-screen bg-black text-white py-12'>
      <h1 className='text-2xl text-center py-12'>Link:{' '}
        <a href={currentURL} target='_blank'>
          {currentURL}
        </a>
      </h1>

      <AdminVideoControls url={currentURL} />
    </div>
  )
}