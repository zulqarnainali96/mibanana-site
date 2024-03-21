const User = require("../models/user-login");

// Send Message to User
const sendMessage = async (id, message) => {
    try {
        const user = await User.findById(id);
        if (user) {
            if (user.project_notifications?.length > 0) {
                user.project_notifications = [...user.project_notifications, message]
                await user.save()
            } else {
                user.project_notifications = [message]
                await user.save()
            }
        }
    } catch (error) {
        console.log(error)
    }
}
// '65f595d63cd6e1a35e2c50ca'
// Send Message to Manager
const sendManagerMessage = async (message) => {
    try {
        const users = await User.find()
        if (users) {
            const filterManager = users.filter(user => {
                return user.roles?.includes('Project-Manager')
            })
            if (filterManager?.length > 0) {
                for (let a = 0; a < filterManager.length; a++) {
                    const currentUser = filterManager[a];
                    const findSingleManager = await User.findById({ _id: currentUser._id })
                    if (findSingleManager) {
                        if (findSingleManager.project_notifications?.length > 0) {
                            findSingleManager.project_notifications = [...findSingleManager.project_notifications, message]
                            await findSingleManager.save()
                        } else {
                            findSingleManager.project_notifications = [message]
                            await findSingleManager.save()
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.log(err)
    }
}

const sendChatsNotifications = async (connectedUser, message, room, roomsArray, teamId, rooms, socket) => {
    socket.join(room)
    socket.to(room).emit('message', message);
    console.log(roomsArray)
    const customerJoinedRoom = roomsArray.find(item => item.roomId === room && item.users.includes(message.authorId));
    console.log(customerJoinedRoom)
    // if(message){
    //   if(message.role === 'Graphic-Designer'){
    //     const customerOnline = connectedUser.some(item => item.id === message.authorId);
    //     const customerJoinedRoom = roomsArray.find(item => item.roomId === room && item.users.includes(message.authorId));
    //     console.log(customerJoinedRoom)
    //     let managerJoinedRoom = null;

    //     const managerOnline = connectedUser.find(item => item.role?.includes('Project-Manager'));
    //     if(managerOnline){
    //         managerJoinedRoom = roomsArray.find(item => item.roomId === room && item.users.includes(message.authorId));
    //     }


    //     if(customerOnline && customerJoinedRoom){
    //         socket.to(room).emit('message', message)
    //     } else if(customerOnline && !customerJoinedRoom) {
    //         socket.emit('new-chat-message',message) 
    //     } else if(!customerOnline && !customerJoinedRoom){
    //         sendMessage(message.authorId, message)
    //     }
    //   }  
    //   if(message.role === 'Project-Manager'){
    //     const customerOnline = connectedUser.some(item => item.id === message.authorId);
    //     const customerJoinedRoom = roomsArray.find(item => item.roomId === room && item.users.includes(message.authorId));
    //     if(customerOnline && customerJoinedRoom){
    //         socket.to(room).emit('message', message)
    //     } else if(customerOnline && !customerJoinedRoom) {
    //         socket.emit('new-chat-message',message) 
    //     } else if(!customerOnline && !customerJoinedRoom){
    //         sendMessage(message.authorId, message)
    //     }
    //   }  
    //   if(message.role === 'Graphic-Designer'){
    //     const customerOnline = connectedUser.some(item => item.id === message.authorId);
    //     const customerJoinedRoom = roomsArray.find(item => item.roomId === room && item.users.includes(message.authorId));
    //     if(customerOnline && customerJoinedRoom){
    //         socket.to(room).emit('message', message)
    //     } else if(customerOnline && !customerJoinedRoom) {
    //         socket.emit('new-chat-message',message) 
    //     } else if(!customerOnline && !customerJoinedRoom){
    //         sendMessage(message.authorId, message)
    //     }
    //   }  



    // }
}

module.exports = { sendMessage, sendChatsNotifications, sendManagerMessage }