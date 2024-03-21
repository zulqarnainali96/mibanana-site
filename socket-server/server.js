var app_chat = require('express')();
var server1 = require('http').Server(app_chat);
const mongoose = require('mongoose')
const cors = require('cors');
const ConnectDB = require('./dbConfig.js/mongo-connection');
const { getValue, getStatusChange } = require('./utility/utility');
const { UpdateProjectNotifications, UpdateWithoutOnline, updateCurrentNotificationsStatus, handleNotificationDelete } = require('./controllers/new-project-notifications');
const { updateAndSendingStatusNotifications, sendingNotificationsCurrentManager, sendingNotificationsToDesigner } = require('./controllers/status-change-notifications');
const { sendMessage, sendManagerMessage } = require('./controllers/team-member-notification')
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
ConnectDB()

let connectedUser = []
mongoose.connection.once('open', () => {
  console.log(`Connected to MongoDB`)
  server1.listen(PORT, () => console.log('Socket server started at ' + PORT));
})

io.on('connection', function (socket) {
  console.log("User Connected ", socket.id)
  socket.on('user_online', (status, id, role) => {
    if (role, id) {
      socket.join(id)
      let obj = {
        socketID: socket.id,
        id,
        status,
        role
      }
      connectedUser.push(obj)
      connectedUser = Array.from(new Set(connectedUser.map(obj => obj.id))).map(id => connectedUser.find(obj => obj.id === id));
      console.log(connectedUser)
      socket.emit('active_users', connectedUser)
    }
  })

  socket.on('new-project', (project_data) => {
    const filterManager = connectedUser.filter(user => {
      return user.role?.includes('Project-Manager')
    })
    if (filterManager.length > 0) {
      for (let c = 0; c < filterManager.length; c++) {
        const manager = filterManager[c]
        const newProject = getValue(project_data, manager.id)
        socket.to(manager.id).emit('new-project-notification', newProject)
        UpdateProjectNotifications(newProject)
      }
    } else {
      const newProject = getValue(project_data)
      UpdateWithoutOnline(newProject)
    }
  })

  socket.on('update-current-notification', async (unique_key, user_id) => {
    const Ok = await updateCurrentNotificationsStatus(unique_key, user_id)
    socket.emit('send-update-notification-status', Ok)
  })

  socket.on('delete-current-notification', async (id, user_id) => {
    const done = await handleNotificationDelete(id, user_id);
    if (done) {
      socket.emit('confirmation-delete-notification', done)
    }
  })

  socket.on('sending-status-change', (item, role, id, status) => {

    console.log("socket ========================================>>>>>>>>>>>>>>>>>>", item)
    const msg = `${role} change status to ${status}`
    const statusData = getStatusChange(item, role, item.user, msg, status)
    const isProjectUser = connectedUser.some(onlineUser => onlineUser.id === item.user)
    if (isProjectUser) {
      const project_creater = connectedUser.find(q => q.id === item.user)
      if (project_creater) {
        console.log('project-creator', project_creater)
        socket.join(project_creater.id)
        socket.to(project_creater.id).emit('status-change-notification', statusData)
        updateAndSendingStatusNotifications(statusData, item)
      }
    }
    else {
      updateAndSendingStatusNotifications(statusData, item)
    }
  })

  socket.on('customer-sending-notifications', (item, role, status) => {
    const msg = `${item.name} change status to ${status}`
    const isManger = connectedUser.some(onlineUser => onlineUser.role?.includes('Project-Manager'))
    if (item?.team_members?.length > 0) {
      const team_member_id = item?.team_members[0]?._id
      const designer = connectedUser.some(onlineUser => onlineUser.id === team_member_id)
      const designerData = getStatusChange(item, role, team_member_id, msg, status)
      if (designer) {
        socket.join(team_member_id)
        socket.to(team_member_id).emit('getting-customer-notifications', designerData, item._id, status)
        sendingNotificationsToDesigner(designerData, team_member_id)
      } else {
        sendingNotificationsToDesigner(designerData, team_member_id)
      }
    }
    if (isManger) {
      // console.log('is Manger')
      const filterManager = connectedUser.filter(user => {
        return user.role?.includes('Project-Manager')
      })
      if (filterManager.length > 0) {
        if (filterManager.length === 1) {
          for (let c = 0; c < filterManager.length; c++) {
            const manager = filterManager[c]
            const managerData = getStatusChange(item, role, manager.id, msg, status)
            socket.join(manager.id)
            socket.to(manager.id).emit('getting-customer-notifications', managerData)
            UpdateWithoutOnline(managerData)
          }
        } else {
          for (let p = 0; p < filterManager.length; p) {
            const manager = filterManager[p]
            const managerData = getStatusChange(item, role, manager.id, msg, status)
            socket.join(manager.id)
            socket.to(manager.id).emit('getting-customer-notifications', managerData)
            sendingNotificationsCurrentManager(managerData, manager.id)
          }
        }
      }
    }
    if (!isManger) {
      const managerData = getStatusChange(item, role, '', msg, status)
      UpdateWithoutOnline(managerData)
    }
  })

  socket.on('project-completed', (data) => {
    const filterManager = connectedUser.filter(user => {
      return user.role?.includes('Project-Manager')
    })

    if (filterManager.length > 0) {
      for (let i = 0; i < filterManager.length; i++) {
        const manager = filterManager[i];
        socket.join(manager.id);
        socket.to(manager.id).emit('project-completed-notification', data);
      }
    }

    socket.emit('project-completed-ack', data);
  })

  socket.on('', () => {

  })

  socket.on("room-message", (message, room, teamId) => {
    const rooms = io.sockets.adapter.rooms;
    socket.join(room)
    socket.to(room).emit('message', message);
    const roomsArray = Array.from(rooms.entries()).map(([roomId, usersSet]) => ({
      roomId,
      users: Array.from(usersSet)
    }));

    // Graphic Designer
    if (message.role === 'Graphic-Designer') {
      const customer = connectedUser.find(user => user.id === String(message.authorId));
      if (customer) {
        const customerJoinedRoom = roomsArray.find(item => item.roomId === room && item.users.includes(customer.socketID));
        if (!customerJoinedRoom) {
          socket.to(customer.socketID).emit('chat-message-notification', message);
          console.log('Customer received message')
        }
      } else {
        sendMessage(message.authorId, message)
        console.log('Testing customer api')
      }

      const manager = connectedUser.find(user => user.role?.includes('Project-Manager'));
      if (manager) {
        const managerJoinedRoom = roomsArray.find(item => item.roomId === room && item.users.includes(manager.socketID));
        if (!managerJoinedRoom) {
          socket.to(manager.socketID).emit('chat-message-notification', message);
          console.log('Manager received message')
        }
      } else {
        sendManagerMessage(message)
        console.log('sending message to Manager')
      }
    }

    // Project Manager
    else if (message.role === 'Project-Manager') {
      const customer = connectedUser.find(user => user.id === String(message.authorId));
      if (customer) {
        const customerJoinedRoom = roomsArray.find(item => item.roomId === room && item.users.includes(customer.socketID));
        if (!customerJoinedRoom) {
          socket.to(customer.socketID).emit('chat-message-notification', message);
          console.log('Customer received message')
        }
      } else {
        sendMessage(message.authorId, message)
        console.log('Testing Customer api')
      }
      if (teamId) {
        const designer = connectedUser.find(user => user.id === String(teamId));
        if (designer) {
          const designerJoinedRoom = roomsArray.find(item => item.roomId === room && item.users.includes(designer.socketID));
          if (!designerJoinedRoom) {
            socket.to(designer.socketID).emit('chat-message-notification', message);
            console.log('Designer received message')
          }
        } else {
          const t = String(teamId)
          sendMessage(t, message)
          console.log('Testing desginer api')
        }
      } else {
        console.log('Team Id is not found')
      }
    }

    // Customer
    else if (message.role === 'Customer') {
      const manager = connectedUser.find(user => user.role?.includes('Project-Manager'));
      if (manager) {
        const managerJoinedRoom = roomsArray.find(item => item.roomId === room && item.users.includes(manager.socketID));
        if (!managerJoinedRoom) {
          socket.to(manager.socketID).emit('chat-message-notification', message);
          console.log('Manager received message')
        }
      } else {
        sendManagerMessage(message)
        console.log('sending message to Manager')
      }
      if (teamId) {
        const designer = connectedUser.find(user => user.id === String(teamId));
        if (designer) {
          const designerJoinedRoom = roomsArray.find(item => item.roomId === room && item.users.includes(designer.socketID));
          if (!designerJoinedRoom) {
            socket.to(designer.socketID).emit('chat-message-notification', message);
            console.log('Designer received message')
          }
        } else {
          const t = String(teamId)
          sendMessage(t, message)
          console.log('sending message to Designer')
        }
      }
      else {
        console.log('Team Id is not found')
      }
    }

    // sendChatsNotifications(connectedUser, message, room, roomsArray, teamId, rooms, socket)
  })
  socket.on('leave-room', (room) => {
    console.log('Start--')
    console.log(`client leaved the ${room} `)
    socket.leave(room)
  })
  socket.on('disconnect', () => {
    connectedUser = connectedUser.filter(user => user.socketID !== socket.id)
    console.log('User disconnected', socket.id);
  })
});
