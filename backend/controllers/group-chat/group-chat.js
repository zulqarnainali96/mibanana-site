const GroupChatModal = require('../../models/group-chat-modal/group-chat-model')

const createGroupChat = async (req, res) => {
    const { group_name, group_description, group_admin, participant } = req.body
    if (!group_name || !participant) {
        return res.status(400).send({ message: 'group name, group_admin, participant are required' })
    }
    try {
        const makeChatGroup = await GroupChatModal.create({
            group_admin, group_name, group_description, participant
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

const updateGroupSetting = async (req, res) => {
    const _id = req.params.id
    const { group_name, group_description, participant } = req.body
    try {
        const updateCurrentGroup = await GroupChatModal.findByIdAndUpdate(_id, { group_name, group_description, participant })
        if (updateCurrentGroup) {
            return res.status(200).send({ message: "Group Updated" })
        } else {
            return res.status(404).send({ message: "No Group found" })
        }
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}

const getGroupsById = async (req, res) => {
    const id = req.params.id
    try {
        const getAllgroups = await GroupChatModal.find()
        if (getAllgroups) {
            const filterGroups = getAllgroups.filter(part => part.participant.some(item => item._id === id))
            // console.log(filterGroups)
            return res.status(200).send({ all_groups: filterGroups })
        } else {
            return res.status(404).send({ all_groups: [], messages: 'Groups not found' })
        }

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}

const deleteGroupChat = async (req, res) => {
    const _id = req.params.id
    if (!_id) {
        return res.status(400).send({ message: 'id not found' })
    }
    try {
        const groups = await GroupChatModal.findByIdAndRemove(_id)
        if (groups) return res.status(200).send({ message: 'Group Deleted' })
        else return res.status(404).send({ message: 'Group not found' })

    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" })
    }

}


module.exports = { createGroupChat, getAllGroupsDetails, updateGroupMessage, getGroupsById, deleteGroupChat, updateGroupSetting }