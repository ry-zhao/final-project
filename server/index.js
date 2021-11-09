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
  activeUsers[screenName] = { socket };
  socket.on('disconnect', socket => {
    delete activeUsers[screenName];
  });
});

app.use(staticMiddleware);
app.use(express.json());

app.get('/api/rooms', (req, res) => {
  res.status(200).json(activeRooms);
});

app.get('/api/test', (req, res) => {
  res.status(200).json({ it: 'worked' });
});

app.post('/api/newroom', (req, res) => {
  console.log(req.body);
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
      io.emit('room update', activeRooms);
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
