var app_chat = require('express')();
var server1 = require('http').Server(app_chat);
const mongoose = require('mongoose')
const cors = require('cors');
const ConnectDB = require('./dbConfig/mongo-connection');
const { getValue, getStatusChange } = require('./utility/utility');
const { UpdateProjectNotifications, UpdateWithoutOnline, updateCurrentNotificationsStatus, handleNotificationDelete } = require('./controllers/new-project-notifications');
const { updateAndSendingStatusNotifications, sendingNotificationsCurrentManager, sendingNotificationsToTeamMember } = require('./controllers/status-change-notifications');
const { sendMessage, sendManagerMessage } = require('./controllers/team-member-notification')
const { v4: uniqeID } = require('uuid');
const { updatePrivateChatMessage } = require('./controllers/private-chat/private-chat');
const sendingGroupMessage = require('./controllers/group-chat-controller/group-chat-controller');
const PORT = 4000
app_chat.use(cors())
var io = require('socket.io')(server1, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://mibanana.com',
      'https://test.mibanana.com',
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
  socket.on('user_online', (status, id, role, name) => {
    if (role, id) {
      let obj = {
        socketID: socket.id,
        id,
        status,
        role,
        name,
      }
      connectedUser.push(obj)
      connectedUser = Array.from(new Set(connectedUser.map(obj => obj.id))).map(id => connectedUser.find(obj => obj.id === id));
      console.log(connectedUser)
      io.emit('active_users', connectedUser)
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
        socket.join(manager.socketID)
        socket.to(manager.socketID).emit('new-project-notification', newProject)
        UpdateProjectNotifications(newProject)
      }
    } else {
      const newProject = getValue(project_data)
      UpdateWithoutOnline(newProject)
    }
  })
  socket.on('project-assigned', (id, msg) => {
    const message = {
      unique_key: uniqeID(),
      ...msg
    }
    if (id) {
      const team_member = connectedUser.find(user => user.id === String(id));
      if (team_member) {
        socket.to(team_member.socketID).emit('new-project-assigned', message);
        const t = String(id)
        sendMessage(t, message)
        console.log('Team member received a message')
      } else {
        const t = String(id)
        sendMessage(t, message)
        console.log('Testing desginer api')
      }
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
    // console.log("socket ===================>>>>", item)
    const msg = `${role} change status to ${status}`
    const statusData = getStatusChange(item, role, item.user, msg, status)
    const isProjectUser = connectedUser.some(onlineUser => onlineUser.id === item.user)
    if (isProjectUser) {
      const project_creater = connectedUser.find(q => q.id === item.user)
      if (project_creater) {
        socket.join(project_creater.socketID)
        socket.to(project_creater.socketID).emit('status-change-notification', statusData)
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
      const team_member = connectedUser.find(onlineUser => onlineUser.id === team_member_id)
      const teamMemberData = getStatusChange(item, role, team_member_id, msg, status)
      if (team_member) {
        console.log('Team member Online')
        socket.join(team_member.socketID)
        socket.to(team_member.socketID).emit('getting-customer-notifications', teamMemberData, item._id, status)
        sendingNotificationsToTeamMember(teamMemberData, team_member_id)
      } else {
        sendingNotificationsToTeamMember(teamMemberData, team_member_id)
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
            socket.join(manager.socketID)
            socket.to(manager.socketID).emit('getting-customer-notifications', managerData)
            UpdateWithoutOnline(managerData)
          }
        } else {
          for (let p = 0; p < filterManager.length; p) {
            const manager = filterManager[p]
            const managerData = getStatusChange(item, role, manager.id, msg, status)
            socket.join(manager.socketID)
            socket.to(manager.socketID).emit('getting-customer-notifications', managerData)
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
  socket.on('join-room', (room) => {
    console.log('Room joined id:', room)
    socket.join(room);

  })
  socket.on("room-message", (msg, room, teamId) => {
    const message = { ...msg, unique_key: uniqeID() }
    const rooms = io.sockets.adapter.rooms;
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
          sendMessage(message.authorId, message)
          // console.log('Customer received message')
        }
      } else {
        sendMessage(message.authorId, message)
        // console.log('Testing customer api')
      }

      const manager = connectedUser.find(user => user.role?.includes('Project-Manager'));
      if (manager) {
        const managerJoinedRoom = roomsArray.find(item => item.roomId === room && item.users.includes(manager.socketID));
        if (!managerJoinedRoom) {
          socket.to(manager.socketID).emit('chat-message-notification', message);
          // sendManagerMessage(message)
          console.log('Manager received message')
        }
      } else {
        // sendManagerMessage(message)
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
          sendMessage(message.authorId, message)
          // console.log('Customer received message')
        }
      } else {
        sendMessage(message.authorId, message)
        // console.log('Testing Customer api')
      }
      if (teamId) {
        const designer = connectedUser.find(user => user.id === String(teamId));
        if (designer) {
          const designerJoinedRoom = roomsArray.find(item => item.roomId === room && item.users.includes(designer.socketID));
          if (!designerJoinedRoom) {
            socket.to(designer.socketID).emit('chat-message-notification', message);
            const t = String(teamId)
            sendMessage(t, message)
            console.log('Designer received message')
          }
        } else {
          const t = String(teamId)
          sendMessage(t, message)
          console.log('Testing desginer api')
        }
      }
    }

    // Customer
    else if (message.role === 'Customer') {
      const manager = connectedUser.find(user => user.role?.includes('Project-Manager'));
      if (manager) {
        const managerJoinedRoom = roomsArray.find(item => item.roomId === room && item.users.includes(manager.socketID));
        if (!managerJoinedRoom) {
          socket.to(manager.socketID).emit('chat-message-notification', message);
          sendManagerMessage(message)
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
            const t = String(teamId)
            sendMessage(t, message)
            console.log('Designer received message')
          }
        } else {
          const t = String(teamId)
          sendMessage(t, message)
          console.log('sending message to Designer')
        }
      }
    }

  })
  socket.on('send-private-message', (msg, id, user_id) => {
    const rooms = io.sockets.adapter.rooms;
    const roomsArray = Array.from(rooms.entries()).map(([roomId, usersSet]) => ({
      roomId,
      users: Array.from(usersSet)
    }));
    const activeOrNot = connectedUser.find(item => item.id === id);
    if (activeOrNot) {
      const privateChatRoom = roomsArray.some(item => item.roomId === user_id && item.users.includes(activeOrNot.socketID));
      if (privateChatRoom) {
        socket.to(activeOrNot.socketID).emit('receive-private-message', { ...msg, view: false });
      } else {
        socket.to(activeOrNot.socketID).emit('send-private-message-notification', { ...msg, view: true });
        console.log(msg.id)
        // updatePrivateChatMessage(msg.id, user_id, id)
      }
    }
  })
  socket.on('send-group-message', async (msg, room) => {
    sendingGroupMessage(io, connectedUser, socket, msg, room)
  });
  socket.on('leave-room', (room) => {
    socket.leave(room)
  })
  socket.on('disconnect', () => {
    connectedUser = connectedUser.filter(user => user.socketID !== socket.id)
    console.log('User disconnected', connectedUser);
    io.emit('active_users', connectedUser)
  })
});