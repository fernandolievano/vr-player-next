import AdminVideoControls from '@/components/AdminVideoControls';
import { Agent, setGlobalDispatcher } from 'undici';
import os from 'os';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import Image from 'next/image';


// TODO: QR link
// TODO: Mini reproductor

type Data = {
  image: any;
  url: string;
};

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

async function fetchData(): Promise<Data> {
  // getting the current IP and port
  const currentIP = getLocalIP();
  const currentPort = process.env.CUSTOM_PORT || 3000;
  const currentURL = `https://${currentIP}:${currentPort}`;
  // getting the current IP and port


  // enabling https requests with self-signed certificates
  const agent = new Agent({
    connect: {
      rejectUnauthorized: false
    }
  });
  setGlobalDispatcher(agent);
  // enabling https requests with self-signed certificates


  // getting the QR code
  const formBody = {
    url: currentURL
  };
  const headers = {
    'Content-Type': 'application/json'
  };

  const res = await fetch(`${currentURL}/get-qr`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(formBody),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const qrImage = await res.json();
  // getting the QR code

  const data: Data = {
    image: qrImage.image,
    url: currentURL
  };

  return data;
}

export default async function AdminPage() {
  const { image, url } = await fetchData();

  return (
    <div className='min-h-screen bg-black text-white py-12'>
      <h1 className='text-2xl text-center py-12'>Link:{' '}
        <a href={url} target='_blank'>
          {url}
        </a>
      </h1>

      <div className="my-4">
        {/* {qrCode} */}
        <Image
          src={image}
          alt="QR Code"
          width={300}
          height={300}
          className="mx-auto"
        />
      </div>

      <AdminVideoControls url={url} />
    </div>
  );
}