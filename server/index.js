require('dotenv/config');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const http = require('http');
const { Server } = require('socket.io');
const pg = require('pg');

const db = new pg.Pool({
  connectionString: 'postgress://dev:dev@localhost/libreKalah',
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

const server = http.createServer(app);
const io = new Server(server);

const activeUsers = {};
const activeRooms = [];

db.query('select * from "gameRooms"')
  .then(result => {
    for (let i = 0; i < result.rows.length; i++) {
      activeRooms[result.rows[i].roomId] = result.rows[i];
    }
  })
  .catch(err => console.error(err));

io.on('connection', socket => {
  socket.join('lobby');
  const { screenName } = socket.handshake.query;
  activeUsers[screenName] = socket;
  socket.on('disconnect', socket => {
    delete activeUsers[screenName];
  });
});

app.use(staticMiddleware);
app.use(express.json());

app.get('/api/rooms', (req, res) => {
  res.status(200).json(activeRooms);
});

app.get('/api/start/roomId/:roomId', (req, res) => {
  res.status(202).json({ it: 'worked' });
  const { roomId } = req.params;
  const positions = [];
  for (let i = 0; i < 12; i++) {
    const pit = [];
    for (let j = 0; j < 4; j++) {
      const x = Math.random();
      const y = Math.random();
      pit.push({ x, y });
    }
    positions.push(pit);
  }
  io.to(activeRooms[roomId].roomName).emit('room update', positions);
});

app.get('/api/test', (req, res) => {
  res.status(200).json({ it: 'worked' });
});

app.post('/api/turn/:pitNumber/room/:roomId', (req, res) => {
  const { pitNumber, roomId } = req.params;
  res.status(202).json({
    pitNumber,
    roomId
  });
});

app.get('/api/joinroom/:roomId/user/:screenName', (req, res) => {
  let { roomId } = req.params;
  const { screenName } = req.params;
  roomId = Number(roomId);

  if (activeRooms[roomId].players === 2) {
    res.status(409).json({ error: 'Room is full.' });
  } else {
    activeUsers[screenName].leave('lobby');
    activeUsers[screenName].join(activeRooms[roomId].roomName);
    if (activeRooms[roomId].players === 0) {
      activeRooms[roomId].playerOne = screenName;
    } else {
      activeRooms[roomId].playerTwo = screenName;
    }
    activeRooms[roomId].players++;
    io.to('lobby').emit('lobby update', activeRooms);
    res.status(200).json({ roomId: roomId });
  }
});

app.post('/api/newroom', (req, res) => {
  const { roomName } = req.body;
  const sql = `
    insert into "gameRooms" ("roomName")
      values ($1)
    returning *
  `;
  const params = [roomName];
  db.query(sql, params)
    .then(result => {
      const newRoom = result.rows[0];
      activeRooms[newRoom.roomId] = newRoom;
      io.to('lobby').emit('lobby update', activeRooms);
      res.status(201).json(newRoom);
    })
    .catch(err => console.error(err));
});

app.post('/api/entername', (req, res) => {
  const { screenName } = req.body;
  const sql = `
    select * from "users"
      where "screenName" = $1
  `;
  const params = [screenName];

  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        return db.query(`
        insert into "users" ("screenName")
        values ($1)
        returning *
        `, params);
      } else {
        return result;
      }
    })
    .then(result => {
      if (!activeUsers[screenName]) {
        res.status(200).send();
      } else {
        res.status(409).json({ error: 'Screen name is currently in use!' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'an unexpected error occured.' });
    });
});

app.use(errorMiddleware);

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
