const chatHistory = require('../../models/chat-history/chat-history-modal')


const updatePrivateChatMessage = async (msgid, userId, recId) => {
    try {
        const findChatHistory = await chatHistory.findOne({ userId: recId }).exec()
        if (findChatHistory) {
            const df = findChatHistory.chated_persons.find(item => item.user_id === userId)
            const filterHistory = findChatHistory.chated_persons.filter(item => item.user_id !== userId).map(u => u)
            if (df) {
                const updateObj = {
                    ...df,
                    unread_messages_count: df.unread_messages_count || 0 + 1,
                    unread_messages_ids: [...df.unread_messages_ids, msgid]
                }
                findChatHistory.chated_persons = [
                    updateObj, ...filterHistory]
                await findChatHistory.save()
            } else {

                const updateObj = {
                    user_id: userId,
                    unread_messages_count: 1,
                    unread_messages_ids: [msgid]
                }
                findChatHistory.chated_persons = [
                    updateObj, ...filterHistory]
                await findChatHistory.save()
            }
        }

    } catch (error) {
        console.log('Msg sending error to chat-history', error)

    }
};
const updateGroupChatMessage = async (msgid, userId, recId) => {
    try {
        const findChatHistory = await chatHistory.findOne({ userId: recId }).exec()
        if (findChatHistory) {
            const df = findChatHistory.chated_persons.find(item => item.user_id === userId)
            const filterHistory = findChatHistory.chated_persons.filter(item => item.user_id !== userId).map(u => u)
            console.log('df', df)
            if (df) {
                console.log('df', df)
                const updateObj = {
                    ...df,
                    unread_messages_count: df.unread_messages_count || 0 + 1,
                    unread_messages_ids: [...df.unread_messages_ids, msgid]
                }
                findChatHistory.chated_persons = [
                    updateObj, ...filterHistory]
                await findChatHistory.save()
            } else {
                console.log('private', )
                const updateObj = {
                    user_id: userId,
                    unread_messages_count: 1,
                    unread_messages_ids: [msgid]
                }
                findChatHistory.chated_persons = [
                    updateObj, ...filterHistory]
                await findChatHistory.save()
            }
        }

    } catch (error) {
        console.log('Msg sending error to chat-history', error)

    }
};



const addNewGroupToUserChatHistory = async (groupId, userId) => {
    try {
        const findChatHistory = await chatHistory.findOne({ userId }).exec()
        if (findChatHistory) {
            findChatHistory.chated_persons.unshift({
                user_id: groupId,
                unread_messages_count: 0,
                unread_messages_ids: []
            })
            await findChatHistory.save()
        }

    } catch (error) {
        console.log('Msg sending error to chat-history', error)

    }
};

module.exports = {
    updatePrivateChatMessage,
    addNewGroupToUserChatHistory,
    updateGroupChatMessage
}