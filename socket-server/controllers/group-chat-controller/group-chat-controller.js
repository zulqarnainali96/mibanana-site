const GroupChatModel = require('../../models/group-chat/group-chat-model');

const sendingMessagetoDatabase = async (msg, room) => {
    const findGroup = await GroupChatModel.findById(room)
    if (findGroup.messages.length > 0) {
        findGroup.messages = [...findGroup.messages, msg]
        await findGroup.save()
    } else {
        findGroup.messages = [msg]
        await findGroup.save()
    }
}

const checkingConnectedUserInGroup = async (io, msg, connectedUser, room, socket) => {
    const rooms = io.sockets.adapter.rooms
    const roomsArray = Array.from(rooms.entries()).map(([roomId, usersSet]) => ({
        roomId,
        users: Array.from(usersSet)
    }));
    const currentRoom = roomsArray.find(item => item.roomId === room)
    const findGroup = await GroupChatModel.findById(room)
    if (findGroup) {
        sendingMessagetoDatabase(msg, room)
        console.log('1')
        if (currentRoom) {
            console.log('2')
            const currentRoomUsers = currentRoom.users
            const part = connectedUser.filter(p => findGroup.participant.some(item => item._id === p.id))
            const findOnlinePart = part.filter(p => !currentRoomUsers.includes(p.socketID))
            if (findOnlinePart.length > 0) {
                for (let i = 0; i <= findOnlinePart.length; i++) {
                    console.log('3')
                    socket.to(findOnlinePart[i]?.socketID).emit('group-msg-notification', msg)
                }
            }

        }
    } else {
        socket.emit('error-message', 'Error: the group you are sending message is not exist')
    }

}

const sendingGroupMessage = async (io, connectedUser, socket, msg, room) => {
    const currentRoom = io.sockets.adapter.rooms.get(room);
    if (currentRoom && currentRoom.size > 1) {
        socket.to(room).emit('receive-group-message', msg);
        const findGroup = await GroupChatModel.findById(room)
        if (findGroup) {
            sendingMessagetoDatabase(msg, room)
        } else {
            socket.emit('error-message', 'Error: the group you are sending message is not exist')
        }
    } else {
        checkingConnectedUserInGroup(io, msg, connectedUser, room, socket)
    }

}

module.exports = sendingGroupMessage
