var app_chat = require('express')();
var server1 = require('http').Server(app_chat);
const cors = require('cors')
app_chat.use(cors())
var io = require('socket.io')(server1,{
 cors : {
        origin : [
            'http://localhost:3000',
            'https://mibanana.com',
            'https://si.mibanana.com'],
            credentials : true,
  }
});
server1.listen(8000, () => console.log('socket server started at 8000'));
io.on('connection', function (socket) {
  console.log("User Connected ", socket.id)
   socket.on("room-message", (message, room) => {
        socket.join(room)
        socket.to(room).emit("message", message)
  })
});

