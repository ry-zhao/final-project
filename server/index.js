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

io.on('connection', socket => {
  const { screenName } = socket.handshake.query;
  const { id: socketId } = socket;
  activeUsers[screenName] = { socketId };
  socket.on('disconnect', socket => {
    delete activeUsers[screenName];
  });
});

app.use(staticMiddleware);
app.use(express.json());

app.get('/test', (req, res) => {
  res.status(200).send('<h1>Hi</h1>');
});

app.post('/entername', (req, res) => {
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
    // .then(result => res.status(200).json({ id: result.rows[0].screenNameId, screenName: result.rows[0].screenName }))
    .then(result => {
      if (!activeUsers[screenName]) {
        res.status(200).send();
      } else {
        res.status(201).json({ error: 'Screen name is currently in use!' });
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
