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

  return (
    <div className='min-h-screen bg-black text-white py-12'>
      <h1 className='text-2xl text-center py-12'>Link:{' '}
        <a href={`https://${currentIP}:${currentPort}`} target='_blank'>
          https://{ currentIP }:{currentPort}
        </a>
      </h1>

      <div className="py-8 flex flex-col gap-4 items-center justify-center">
        <h2>Cargar video:</h2>
        <input type="file" name="" id="" />
      </div>

      <div className="py-8 text-center">
        <h2 className='mb-4'>Controles del video:</h2>

        <div className="flex gap-4 items-center justify-center">
        <button className='bg-blue-400 px-4 py-2 rounded'>Play</button>
        <button className='bg-blue-400 px-4 py-2 rounded'>Pause</button>
        <button className='bg-blue-400 px-4 py-2 rounded'>Stop</button>

        <p>Barrita del video</p>
        </div>
      </div>
    </div>
  )
}