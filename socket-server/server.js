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

  socket.on('user_online', (status) => {
    socket.join(status.id)
    let obj = {}
    obj.id = status.id
    obj.status = status.status
    obj.role = status.role
    connectedUser.push(obj)
    const uniqueUserDetails = Array.from(new Set(connectedUser.map(obj => obj.id))).map(id => connectedUser.find(obj => obj.id === id));
    console.log('user details ', uniqueUserDetails)
    socket.emit('active_users', uniqueUserDetails)
  })

  socket.on('new-project', (project_data) => {
    // code to handle new project event
    for (const c = 0; c < connectedUser.length; c++) {
      const manager = connectedUser[c]
      if (manager.role[0] === 'Project-Manager') {
        socket.join(manager.id)
        socket.to(manager.id).emit('new-project-notification', {
          id: project_data._id,
          project_title: project_data.title,
          author: project_data.name,
          userid: project_data.user,
          project_category: project_data.project_category,
          message: `new project created by ${project_data.name}`
        })
      }
    }
  })

  socket.on("room-message", (message, room) => {
    socket.join(room)
    socket.to(room).emit("message", message)
  })

});

