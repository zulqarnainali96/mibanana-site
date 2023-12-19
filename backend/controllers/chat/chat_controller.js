const chatModel = require("../../models/chat/chat-model")
const asyncHandler = require("express-async-handler")

const createChatController = asyncHandler(async (req, res) => {

    const { project_id, chat_message } = req.body

    if (!project_id || !chat_message) {
        return res.status(400).send({ message: "All fields are required " })
    }
    const Chat = await chatModel.findOne({ project_id }).exec()
    if (Chat === null) {
        // console.log('chat ' ,Chat)
        await chatModel.create({ project_id, chat_msg: chat_message })
        return res.status(200).json({ message: 'Chat Created' })
    }
    if (Chat.chat_msg?.length) {
        Chat.chat_msg = [...Chat.chat_msg, chat_message]
    } else {
        Chat.chat_msg = [chat_message]
    }
    const saving = await Chat.save()
    // console.log('saving ' ,saving)
    if (saving !== null) {
        return res.status(200).send({ message: "Chat saved" })
    }
    return res.status(404).send({ message: 'not found any chat' })
})


const getProjectChat = asyncHandler(async (req, res) => {
    const project_id = req.params.id
    if (!project_id) {
        return res.status(400).send({ message: "Project ID required " })
    }
    const chat = await chatModel.findOne({ project_id }).exec()
    if (chat !== null) {
        return res.status(200).send({ message: "chat found ", chat })
    }
    return res.status(400).send({ message: "Not found anything" })

})

const findChatWithIDs = async (req, res) => {
    const { user, arrayofIDS } = req.body
    if (!arrayofIDS || !user) {
        return res.status(400).send({ message: "required field is not provided " })
    }
    try {
        const allChats = await chatModel.find()
        const findAllChats = allChats.filter(item => arrayofIDS.some(ids => item.project_id == ids))
        const singleArray = []
        for (let i = 0; i < findAllChats?.length; i++) {
            const arr = findAllChats[i].chat_msg
            arr.map((item) => {
                if (item.user !== user) {
                    singleArray.push(item)
                }
            })
        }
        console.log(singleArray)
        return res.status(200).send({ message: "TESTING NOW" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = { createChatController, getProjectChat, findChatWithIDs }