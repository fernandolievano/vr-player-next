const { createServer } = require('https');
const express = require('express');
const next = require('next');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const { info } = require('console');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem'))
};

app.prepare().then(() => {
  const expressApp = express();

  const server = createServer(httpsOptions, expressApp);
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    io.emit('message', 'Hi there!');

    socket.on('message', (msg) => {
      io.emit('message', msg);

      console.log('Message received:', msg);
    });

    socket.on('action', (msg) => {
      io.emit('action', msg);

      console.log('Action received:', msg);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  expressApp.get('*', (req, res) => {
    handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on https://localhost:3000');
  });
});
