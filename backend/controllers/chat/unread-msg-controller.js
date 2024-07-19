const unreadMsg = require('../../models/chat/personal-chat/unread-chat-message');

// Create Unread Message 
const UnreadMsgController = async (req, res) => {
    const { user_id } = req.params;
    const { message } = req.body;
    try {
        const unread_msg = await unreadMsg.find({ user_id })
        if (unread_msg) {
            if (unread_msg.unread_message?.length > 0) {
                unread_msg.unread_message = [...unread_msg.unread_message, message]
                await unread_msg.save()

                return res.status(200).send({
                    message: "Unread Message Added Successfully",
                    unread_msg
                })
            } else {
                unread_msg.unread_message = [message]
                await unread_msg.save()
                return res.status(200).send({
                    message: "Unread Message Added Successfully",
                    unread_msg
                })
            }
        } else {
            await unreadMsg.create({
                user_id,
                unread_message: [message]
            })
            return res.status(201).send({
                message: "Unread Message Created Successfully",
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: "Internal Server Error",
        });
    }
}

module.exports = { UnreadMsgController }