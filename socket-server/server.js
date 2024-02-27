var app_chat = require('express')();
var server1 = require('http').Server(app_chat);
const cors = require('cors')
const PORT = 4000
app_chat.use(cors())
var io = require('socket.io')(server1, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://mibanana.com',
      'https://si.mibanana.com'],
    credentials: true,
  }
});
const connectedUser = []

server1.listen(PORT, () => console.log('socket server started at ' + PORT));
io.on('connection', function (socket) {
  console.log("User Connected ", socket.id)
  socket.on('user_online_status', ({ status, id, role }) => {
    let obj = {}
    obj.id = id
    obj.status = status
    obj.role = role
    connectedUser.push(obj)
    console.log(status)
    console.log('user details ', connectedUser)
  })
  socket.on("room-message", (message, room) => {
    console.log('message :', message, ' room :', room);
    socket.join(room)
    socket.to(room).emit("message", message)
  })
});

