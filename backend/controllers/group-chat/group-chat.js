const GroupChatModal = require('../../models/chat/group-chat-modal/group-chat-model')
const chatHistory = require('../../models/chat/chat-history/chat-history-modal')


const createGroupChat = async (req, res) => {
    const { group_name, group_description, group_admin, participant, admin_id } = req.body
    if (!group_name || !participant || !group_admin) {
        return res.status(400).send({ message: 'group name, group_admin, group_admin, participant are required' })
    }
    try {
        const makeChatGroup = await GroupChatModal.create({
            group_admin, group_name, group_description, admin_id, participant
        })
        if (makeChatGroup) {
            const findCreatedGroup = await GroupChatModal.findById(makeChatGroup._id)
            const filterParticipants = findCreatedGroup.participant.map(part => part._id);

            return res.status(201).send({ message: "Chat Group Created", participant: filterParticipants, groupData: findCreatedGroup })
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
        // const filterParticpant = await 
        const updateCurrentGroup = await GroupChatModal.findById(_id)
        if (updateCurrentGroup) {
            const prevParticpant = updateCurrentGroup.participant.map(part => part._id);
            const newParticpant = participant.map(part => part._id);
            const currentParticipant = prevParticpant.filter(part => !newParticpant.includes(part));
            const removeGroupParticipant =  newParticpant.filter(part => !prevParticpant.includes(part));

            // If new Participant to group
            if (currentParticipant.length > 0) {
                for (let c = 0; c < currentParticipant.length; c++) {
                    const newMembers_id = currentParticipant[c]
                    await chatHistory.findOneAndUpdate({ userId: newMembers_id }, { $push: { chated_persons: { user_id: _id, unread_messages_count: 0, unread_messages_ids: [] } } }, { new : true })

                }
            }
            // If Participant removed from group
            if(removeGroupParticipant.length > 0){
                for (let c = 0; c < removeGroupParticipant.length; c++) {
                    const removeMembers_id = removeGroupParticipant[c]
                    await chatHistory.findOneAndUpdate({ userId: removeMembers_id }, { $pull: { chated_persons: { user_id: _id } } }, { new : true })
                }
            }

            updateCurrentGroup.participant = participant
            updateCurrentGroup.group_name = group_name
            updateCurrentGroup.group_description = group_description
            await updateCurrentGroup.save()
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
        const findGroup = await GroupChatModal.findById(_id)
        if (findGroup) {
            const participant = findGroup.participant.map(part => part._id);
            if (participant.length > 0) {
                for (let i = 0; i < participant.length; i++) {
                    const findChatHistory = await chatHistory.findOne({ userId: participant[i] })
                    if (findChatHistory) {
                        const filterH = findChatHistory.chated_persons.filter(cp => cp.user_id !== _id)
                        findChatHistory.chated_persons = filterH
                        await findChatHistory.save()
                    }
                }
                const groups = await GroupChatModal.findByIdAndRemove(_id)
                if (groups) return res.status(200).send({ message: 'Group Deleted' })
            }
        }
        else {
            return res.status(404).send({ message: 'Group not found' })
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" })
    }

}

const getGroupMessages = async (req, res) => {
    const _id = req.params.id
    if (!_id) {
        return res.status(400).send({ message: 'id not found' })
    }
    try {
        const groups = await GroupChatModal.findById(_id)
        if (groups) return res.status(200).send({ messages: groups.messages })
        else return res.status(404).send({ message: 'Group not found' })

    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" })
    }

}


module.exports = { createGroupChat, getAllGroupsDetails, updateGroupMessage, getGroupsById, deleteGroupChat, updateGroupSetting, getGroupMessages }