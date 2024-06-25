const personalChat = require("../../models/chat/personal-chat/personal-chat")

const createPersonalChat = async (req, res) => {
    const user_id = req.params.user_id
    const receiver = req.params.receiver
    const msg = req.body
    try {
        const userChats = await personalChat.findOne({ user_id }).lean().exec()
        if (userChats) {
            let findReceiver = userChats.chats.find(chat => chat.receiver === receiver)
            if (findReceiver) {
                const senderObject = await personalChat.findOne({ user_id })
                const index = userChats.chats.indexOf(findReceiver)
                let msgArray = findReceiver.message
                senderObject.chats[index] = { receiver, message: [...msgArray, msg] }

                const receiverObject = await personalChat.findOne({ user_id: receiver }).lean().exec()
                if (receiverObject) {
                    let saveSenderMsg = receiverObject.chats.find(chat => chat.receiver === user_id)
                    if (saveSenderMsg) {
                        let senderMsgArray = saveSenderMsg.message
                        const index = receiverObject.chats.indexOf(saveSenderMsg)
                        const receiverObject2 = await personalChat.findOne({ user_id: receiver })
                        receiverObject2.chats[index] = { receiver: user_id, message: [...senderMsgArray, msg] }
                        await senderObject.save()
                        await receiverObject2.save()
                        return res.status(201).send({ message: 'Message sent 1' })

                    } else {
                        const receiverObject2 = await personalChat.findOne({ user_id: receiver })
                        receiverObject2.chats = [...receiverObject.chats, { receiver: user_id, message: [msg] }]
                        await receiverObject2.save()
                        await senderObject.save()
                        return res.status(201).send({ message: 'Message sent 2' })
                    }
                } else {
                    await personalChat.create({
                        user_id: receiver,
                        chats: [{
                            receiver: user_id,
                            message: [msg]
                        }]
                    })
                    return res.status(200).send({ message: "Message sent and receiver created" })
                }
            } else {
                const senderObject = await personalChat.findOne({ user_id })
                senderObject.chats = [...userChats.chats, { receiver, message: [msg] }]
                const receiverObject3 = await personalChat.findOne({ user_id: receiver }).exec()
                if (receiverObject3 === null) {
                    await personalChat.create({
                        user_id: receiver,
                        chats: [{
                            receiver: user_id,
                            message: [msg]
                        }]
                    })
                    await senderObject.save()
                    return res.status(200).send({ message: "Message sent" })
                } else {
                    let saveSenderMsg = receiverObject3.chats.find(chat => chat.receiver === user_id)
                    if (saveSenderMsg) {
                        let senderMsgArray = saveSenderMsg.message
                        const index = receiverObject3.chats.indexOf(saveSenderMsg)
                        // const receiverObject4 = await personalChat.findOne({ user_id: receiver })
                        receiverObject3.chats[index] = {
                            receiver: user_id, message: [...senderMsgArray, msg]
                        }
                    } else {
                        receiverObject3.chats = [...receiverObject3.chats, {
                            receiver: user_id,
                            message: [msg]
                        }]
                    }
                }
            }
        }
        else {
            await personalChat.create({
                user_id,
                chats: [{
                    receiver,
                    message: [msg]
                }]
            })
            const receiverObject = await personalChat.findOne({ user_id: receiver }).exec()
            if (receiverObject === null) {
                await personalChat.create({
                    user_id: receiver,
                    chats: [{
                        receiver: user_id,
                        message: [msg]
                    }]
                })
            }
            return res.status(200).send({ message: "Chat created new" })
        }
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error' })
    }
}

const getPersonalChat = async (req, res) => {
    const receiver = req.params.receiver
    const user_id = req.params.user_id
    try {
        const userChats = await personalChat.findOne({ user_id }).lean().exec()
        if (userChats) {
            let findReceiver = userChats.chats.find(chat => chat.receiver === receiver)
            if (findReceiver) {
                return res.status(200).send({ message: "chat found ", chats: findReceiver })
            } else {
                return res.status(404).send({ message: "No Chat Founds" })
            }
        } else {
            return res.status(404).send({ message: "Chats Empty" })
        }
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error' })
    }

}

module.exports = { createPersonalChat, getPersonalChat }