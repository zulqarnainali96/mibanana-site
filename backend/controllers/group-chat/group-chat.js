const GroupChatModal = require('../../models/group-chat-modal/group-chat-model')

const createGroupChat = async (req, res) => {
    const { group_name, group_description, group_admin, participant, messages } = req.body
    if (!group_name || !group_admin || !participant) {
        return res.status(400).send({ message: 'group name, group_admin, participant are required' })
    }
    try {
        const makeChatGroup = await GroupChatModal.create({
            group_admin, group_name, group_description, participant, messages
        })
        if (makeChatGroup) {
            return res.status(201).send({ message: "Chat Group Created" })
        } else {
            return res.status(401).send({ message: "Found Error try again !" })
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}

const getAllGroupsDetails = async (req, res) => {
    try {
        const getAllgroups = await GroupChatModal.find()
        if (getAllgroups) {
            return res.status(200).send({ all_groups: getAllgroups })
        } else {
            return res.status(404).send({ all_groups: [], messages: 'Groups not found' })
        }

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}

const updateGroupMessage = async (req, res) => {
    const _id = req.params.id
    const message = req.body
    try {
        const singleGroups = await GroupChatModal.findById(_id)
        if (singleGroups) {
            if (singleGroups.messages.length > 0) {
                singleGroups.messages = [...singleGroups.messages, message]
                await singleGroups.save()
                return res.status(201).send({ message: "Groups message updated" })
            } else {
                singleGroups.messages = [message]
                await singleGroups.save()
                return res.status(201).send({ message: "Single Groups message updated" })
            }
        } else {
            return res.status(404).send({ message: "No group found" })
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}


module.exports = { createGroupChat, getAllGroupsDetails, updateGroupMessage }