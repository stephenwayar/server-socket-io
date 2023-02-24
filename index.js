const express = require('express');
const cors = require('cors')
const http = require('http');
const { Server } = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

app.use(cors())

io.on('connection', (socket) => {
  // On connection, user subscribes with their ID
  socket.on('subscribe', (data) => {
    socket.join(data.myId)
    console.log( `I joined with ID: ${data.myId}`)
  })

  socket.on('newOutbox', (data) => {
    // New message sent from subscribed user
    // data can be stored in DB
    // console.log(data)

    // send data to everyone subscribed including sender
    socket.broadcast.emit('newInbox', data)
    console.log(`'Everyone in the network should get ${data}`)
  })

  socket.on('newOutboxToJane', (data) => {
    // send data to user with the ID given
    socket.to(data.receiverId).emit('newInbox', data)
    console.log(`Only jane got this message ${data.receiverId}`)
  })
})

server.listen(3001, () => {
  console.log('Server running on port 3001');
});