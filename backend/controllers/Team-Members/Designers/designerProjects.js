
// Models
const mongoose = require("mongoose")
const graphicDesignerProjects = require("../../../models/team_members/graphic_model")
const User = require("../../../models/UsersLogin")
const chatHistory = require("../../../models/chat/chat-history/chat-history-modal")
///
const asyncHandler = require("express-async-handler")
const { findRole } = require("../../../utils/helper")
const groupChatModal = require('../../../models/chat/group-chat-modal/group-chat-model')

const createGraphicProject = asyncHandler(async (req, res) => {
    const { designer_project_list, user, id } = req.body // Here Graphic Desiger ID is required of which Project manager  has Projects,

    if (!id) {
        return res.status(400).send("ID not provided please login again!")
    }
    if (!designer_project_list?.length) {
        return res.status(400).send({ message: "Please add a project before assign!" })
    }
    if (id && user && designer_project_list?.length) {
        const find = await User.findOne({ _id: id }).exec()

        if (find && find.roles.includes("Project-Manager")) {
            const obj = { user, designer_project_list }
            const assign = await graphicDesignerProjects.create(obj)
            if (assign) {
                return res.status(200).send({ message: "Project is Assigned" })
            }
            return res.status(400).send({ message: "Unable to assign project Try again!" })
        }
        return res.status(400).send({ message: "your are not allowed to assign projects!" })
    }
    return res.status(404).send({ message: "Invalid data unable to assign Try again!" })
})
const getAssignGraphicProject = asyncHandler(async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send("ID not provided please login again!")
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid ID format.");
    }
    if (id) {
        const user = await User.findOne({ _id: id }).exec()
        if (user !== null && user.roles.includes("Graphic-Designer")) {
            const getProjects = await graphicDesignerProjects.find({ user: id }).exec()
            if (getProjects) {
                return res.status(200).send({ message: "List fetch Successfully", projects: getProjects })
            }
            return res.status(400).send({ message: "Unable to get Design Projects Try again!" })
        }
        return res.status(400).send({ message: "your are not allowed to see graphic projects!" })
    }
})
const getDesignerList = asyncHandler(async (req, res) => {
    const id = req.params.id
    if (!id) return res.status(400).send("Please provide ID")
    if (id) {
        const isManager = await User.find({ _id: id }).exec()
        if (isManager[0] !== null && isManager[0].roles.includes("Project-Manager")) {
            const designerList = await User.find().select('-password').lean().exec()

            const filterDesigner = designerList.filter(item =>
                item.roles.includes("Graphic-Designer")
            ).map(item => {
                return {
                    _id: item._id,
                    name: item.name,
                    email: item.email,
                    roles: item.roles,
                    avatar: item.avatar
                };
            });
            return res.status(200).send({ designerlist: filterDesigner })
        }
        else {
            return res.status(400).send('You are not allowed')
        }
    }
})
const getTeamMemberList = async (req, res) => {
    const id = req.params.id
    const category = req.params.category
    if (!id) return res.status(400).send("Please provide ID")
    if (id) {
        const user = await User.findOne({ _id: id }).exec()
        if (findRole(user).projectManager || findRole(user).teamMember || findRole(user).admin) {
            const allUser = await User.find().select('-password').lean().exec()
            if (category === 'mobile-app-development') {
                const mobileDev = allUser.filter(item =>
                    item.roles.includes("Mobile-App-Developer")
                ).map(item => {
                    return {
                        _id: item._id,
                        name: item.name,
                        email: item.email,
                        roles: item.roles,
                        avatar: item.avatar
                    };
                });
                return res.status(200).send({ list: mobileDev })
            }
            else if (category === 'web-app') {
                const webDeveloper = allUser.filter(item =>
                    item.roles.includes("Web-Developer")
                ).map(item => {
                    return {
                        _id: item._id,
                        name: item.name,
                        email: item.email,
                        roles: item.roles,
                        avatar: item.avatar
                    };
                });
                return res.status(200).send({ list: webDeveloper })
            }
            else if (category === 'social-media-manager') {
                const socialMediaManager = allUser.filter(item =>
                    item.roles.includes("Social-Media-Manager")
                ).map(item => {
                    return {
                        _id: item._id,
                        name: item.name,
                        email: item.email,
                        roles: item.roles,
                        avatar: item.avatar
                    };
                });
                return res.status(200).send({ list: socialMediaManager })
            }
            else if (category === 'copy-writing') {
                const copyWriter = allUser.filter(item =>
                    item.roles.includes("Copy-Writer")
                ).map(item => {
                    return {
                        _id: item._id,
                        name: item.name,
                        email: item.email,
                        roles: item.roles,
                        avatar: item.avatar
                    };
                });
                return res.status(200).send({ list: copyWriter })
            }
            else if (category === 'website-development') {
                console.log(category)
                const websiteDevlopment = allUser.filter(item =>
                    item.roles.includes("Web-Developer")
                ).map(item => {
                    return {
                        _id: item._id,
                        name: item.name,
                        email: item.email,
                        roles: item.roles,
                        avatar: item.avatar
                    };
                });
                return res.status(200).send({ list: websiteDevlopment })
            }
            else if (category === 'graphic-design' || category === 'Graphic Design') {
                const designers = allUser.filter(item =>
                    item.roles.includes("Graphic-Designer")
                ).map(item => {
                    return {
                        _id: item._id,
                        name: item.name,
                        email: item.email,
                        roles: item.roles,
                        avatar: item.avatar
                    };
                });
                return res.status(200).send({ list: designers })
            }
        }
        else {
            return res.status(400).send('User not found')
        }
    }
}
const getTeamMemberList2 = async (req, res) => {
    const userId = req.params.id
    try {
        const user = await User.find().exec()
        if (user) {
            const chat_history = await chatHistory.findOne({ userId }).exec()
            const ff = user.filter(item => {
                if (!item.roles.includes("Admin") && !item.roles.includes("Customer") && item._id.toString() !== userId)
                    return item
            }).map(item => {
                return {
                    _id: item._id,
                    name: item.name,
                    email: item.email,
                    roles: item.roles,
                    avatar: item.avatar
                };
            });
            const allGroups = await groupChatModal.find().exec()
            const filterGroups = allGroups.filter(item => {
                if (item.admin_id === userId) return item
                else if (item.participant.some(part => part._id === userId)) return item
            }).map(u => {
                return {
                    _id: u._id,
                    group_name: u.group_name,
                    group_admin: u.group_admin,
                    admin_id: u.admin_id,
                    group_description: u.group_description,
                    participant: u.participant,
                    type: 'group',
                    createdAt: u.createdAt,
                    updatedAt: u.updatedAt,

                }
            })
            const sortedTeamMembers = [...ff, ...filterGroups].map(member => {
                const chatPerson = chat_history.chated_persons.find(cp => cp.user_id === member._id.toString());
                return {
                    ...member,
                    unread_messages_count: chatPerson?.unread_messages_count || 0,
                    unread_messages_ids: chatPerson?.unread_messages_ids || [],
                    chatIndex: chatPerson ? chat_history.chated_persons.indexOf(chatPerson) : Infinity
                };
            })
                .sort((a, b) => a.chatIndex - b.chatIndex)
                .map(({ chatIndex, ...rest }) => rest);

            return res.status(200).send({ list: sortedTeamMembers })
        } else {
            return res.status(404).send('No user found')
        }

    } catch (error) {
        return res.status(500).send('Interal Server Error')
    }
}
const getTeamMemberList3 = async (req, res) => {
    const userId = req.params.id
    try {
        const user = await User.find().exec()
        if (user) {
            const list = user.filter(item => {
                if (!item.roles.includes("Admin") && !item.roles.includes("Customer") && item._id.toString() !== userId)
                    return item
            }).map(item => {
                return {
                    _id: item._id,
                    name: item.name,
                    email: item.email,
                    roles: item.roles,
                    avatar: item.avatar
                };
            });
            return res.status(200).send({ list})
        } else {
            return res.status(404).send('No user found')
        }

    } catch (error) {
        return res.status(500).send('Interal Server Error')
    }
}
const getTeamMemberListForChat = async (req, res) => {
    const category = req.params.category
    try {
        const allUser = await User.find().select('-password').lean().exec()
        if (category === 'mobile-app-development') {
            const list = allUser.filter(item =>
                item.roles.includes("Mobile-App-Developer")
            ).map(item => {
                return {
                    _id: item._id,
                    name: item.name,
                    email: item.email,
                    roles: item.roles,
                    avatar: item.avatar
                };
            });
            return res.status(200).send({ list })
        }
        else if (category === 'web-app') {
            const list = allUser.filter(item =>
                item.roles.includes("Web-Developer")
            ).map(item => {
                return {
                    _id: item._id,
                    name: item.name,
                    email: item.email,
                    roles: item.roles,
                    avatar: item.avatar
                };
            });
            return res.status(200).send({ list })
        }
        else if (category === 'social-media-manager') {
            const list = allUser.filter(item =>
                item.roles.includes("Social-Media-Manager")
            ).map(item => {
                return {
                    _id: item._id,
                    name: item.name,
                    email: item.email,
                    roles: item.roles,
                    avatar: item.avatar
                };
            });
            return res.status(200).send({ list })
        }
        else if (category === 'copy-writing') {
            const list = allUser.filter(item =>
                item.roles.includes("Copy-Writer")
            ).map(item => {
                return {
                    _id: item._id,
                    name: item.name,
                    email: item.email,
                    roles: item.roles,
                    avatar: item.avatar
                };
            });
            return res.status(200).send({ list })
        }
        else if (category === 'website-development') {
            const list = allUser.filter(item =>
                item.roles.includes("Web-Developer")
            ).map(item => {
                return {
                    _id: item._id,
                    name: item.name,
                    email: item.email,
                    roles: item.roles,
                    avatar: item.avatar
                };
            });
            return res.status(200).send({ list })
        }
        else if (category === 'graphic-design') {
            const list = allUser.filter(item =>
                item.roles.includes("Graphic-Designer")
            ).map(item => {
                return {
                    _id: item._id,
                    name: item.name,
                    email: item.email,
                    roles: item.roles,
                    avatar: item.avatar
                };
            });
            return res.status(200).send({ list })
        }
    }
    catch (error) {
        return res.status(500).send({ message: 'Internal Server Error' })
    }
}

module.exports = { createGraphicProject, getAssignGraphicProject, getDesignerList, getTeamMemberList2, getTeamMemberList3, getTeamMemberList, getTeamMemberListForChat }