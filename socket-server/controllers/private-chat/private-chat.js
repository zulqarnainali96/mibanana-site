const PrivateChatModel = require('../../models/personal-chat/personal-chat')

const updatePrivateChatMessage = async (id, userId, receiver) => {
    try {
        const privateChat = await PrivateChatModel.findOne({ user_id: receiver })
        if (privateChat) {
            const chat = privateChat.chats
            const currentChat = chat.find(item => item.receiver === userId)
            if (currentChat) {
                const currentMessage = currentChat.message
                const indexNo = chat.indexOf(currentMessage - 1)
                console.log(indexNo)
                for (let i = currentMessage.length - 1; i >= 0; i--) {
                    if (currentMessage[i].id === id) {

                        console.log('Testing running -1')
                        break;
                    }
                }
                console.log('Testing running')
            }
        }
    }
    catch (error) {
        console.log(error.message)
    }
}

// const updatePrivateChatMessage = async (id, userId, receiver) => {
//     try {
//         const privateChat = await PrivateChatModel.findOne({ user_id: receiver });
//         if (!privateChat) {
//             console.log('User not found');
//             return;
//         }

//         const chat = privateChat.chats.find(chat => chat.receiver === userId);
//         if (!chat) {
//             console.log('Chat with receiver not found');
//             return;
//         }

//         const message = chat.message.find(msg => msg.id === id);
//         if (!message) {
//             console.log('Message not found');
//             return;
//         }

//         message.view = true;

//         // Debugging: Print the message to be updated
//         console.log('Message to update:', message);

//         // Save the updated document
//         await privateChat.save();

//         // Verify the update
//         const updatedChat = await PersonalChat.findOne({ user_id: receiver, 'chats.receiver': userId });
//         const updatedMessage = updatedChat.chats
//             .find(chat => chat.receiver === userId)
//             .message.find(msg => msg.id === messageId);

//         console.log('Updated message view:', updatedMessage.view);

//     } catch (error) {
//         console.log('Error updating message view:', error.message);
//     }

// };
module.exports = {
    updatePrivateChatMessage
}