const { createServer } = require('https');
const express = require('express');
const next = require('next');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors')

const CUSTOM_PORT = process.env.CUSTOM_PORT || 443;
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
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"]
    }
  });

  expressApp.use(cors())

  io.on('connection', (socket) => {
    console.log('New user connected!');

    io.emit('message', 'Hi there! A new user has joined!');

    socket.on('message', (msg) => {
      io.emit('message', msg);

      console.log('Message received:', msg);
    });

    socket.on('action', (msg) => {
      io.emit('action', msg);

      console.log('Action received:', msg);
    });

    socket.on('video-path', (path) => {
      console.log('video url is: ', path);
      io.emit('video-path', path);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  expressApp.get('*', (req, res) => {
    handle(req, res);
  });

  const storage = multer.diskStorage({
    destination: './public/videos/',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  // Initialize upload variable
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000000 }, // 2GB lmao
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    }
  }).single('video'); // 'video' is the name attribute in the form

  // Check file type
  function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /mp4|mov|wmv|avi/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Videos Only!');
    }
  }

  // Upload video endpoint
  expressApp.post('/upload-video', (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        res.send({ msg: err });
      } else {
        if (req.file == undefined) {
          res.send({
            msg: 'Error: No File Selected!'
          });
        } else {
          res.send({
            msg: 'File Uploaded!',
            file: `videos/${req.file.filename}`
          });
        }
      }
    });
  });

  // Make sure the /public/videos folder exists or create it
  const videosDir = path.join(__dirname, 'public', 'videos');
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }

  server.listen(CUSTOM_PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://localhost:${CUSTOM_PORT}`);
  });
});
