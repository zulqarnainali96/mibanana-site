const User = require("../../models/UsersLogin")
const graphicDesign = require("../../models/graphic-design-model")

const postMessageToOtherMembers = async (req, res) => {
    const { userId, role, message, projectID } = req.body
    if (!userId || !role || !message || !projectID) {
        return res.status(400).send({ message: "required field is not provided " })
    }
    try {
        const findProject = await graphicDesign.findById({ _id: projectID })
        if (role === "Project-Manager") {
            if (findProject !== null) {
                const _id = findProject.user
                const findUser = await User.findById(_id)
                console.log(findUser)
                if (findUser) {
                    const notifications = findUser.notifications
                    if (notifications?.length > 0) {
                        findUser.notifications = [...notifications, message]
                        console.log('Manager')
                        await findUser.save()
                    } else {
                        findUser.notifications = [message]
                        await findUser.save()
                    }
                }
                const team_members = findProject.team_members
                if (team_members.length > 0) {
                    for (let i = 0; i < team_members.length; i++) {
                        const currentMember = team_members[i]
                        const findTeamMember = await User.findById({ _id: currentMember._id })
                        if (findTeamMember) {
                            const notifications = findTeamMember.notifications
                            if (notifications?.length > 0) {
                                findTeamMember.notifications = [...notifications, message]
                                await findTeamMember.save()
                                console.log('Manager')
                            } else {
                                findTeamMember.notifications = [message]
                                await findTeamMember.save()
                            }
                        }
                    }
                }
                return res.status(201).send({ message: 'Notifcations updated from Manager' })
            } else {
                throw new Error("Internal Server Error")
            }
        }
        if (role === "Graphic-Designer") {
            if (findProject !== null) {
                const findManager = await User.find()
                if (findManager) {
                    const manager = findManager.filter(item => item.roles.includes("Project-Manager"))
                    if (manager?.length > 0) {
                        for (let y = 0; y < manager?.length; y++) {
                            const _id = manager[y]?._id
                            const notifications = manager[y].notifications
                            if (notifications?.length > 0) {
                                console.log('Graphic-Designer')
                                await User.findByIdAndUpdate(_id, { notifications: [...notifications, message] })
                            } else {
                                await User.findByIdAndUpdate(_id, { notifications: [message] })
                            }
                        }
                    }
                }
                const findUser = await User.findById({ _id: findProject.user })
                if (findUser) {
                    const notifications = findUser.notifications
                    if (notifications?.length > 0) {
                        console.log('Graphic-Designer')
                        findUser.notifications = [...notifications, message]
                        await findUser.save()
                    } else {
                        findUser.notifications = [message]
                        await findUser.save()
                    }
                }
                return res.status(201).send({ message: 'Notifcations updated from Designer' })
            } else {
                throw new Error("Internal Server Error")
            }

        }
        if (role === "Customer") {
            if (findProject !== null) {
                const findManager = await User.find().lean()
                if (findManager) {
                    const manager = findManager.filter(item => item.roles.includes("Project-Manager"))
                    if (manager?.length > 0) {
                        for (let y = 0; y < manager?.length; y++) {
                            const _id = String(manager[y]?._id)
                            console.log(_id)
                            const notifications = manager[y].notifications
                            if (notifications?.length > 0) {
                                console.log('Customer')
                                const result = await User.findById(_id)
                                const arr = [...notifications, message]
                                result.notifications = arr
                                const tt = await result.save()
                                console.log(tt)
                            } else {
                                await User.findByIdAndUpdate(_id, { notifications: [message] })
                            }
                        }
                    }

                }
                const team_members = findProject.team_members
                if (team_members.length > 0) {
                    for (let i = 0; i < team_members.length; i++) {
                        const currentMember = team_members[i]
                        const findTeamMember = await User.findById({ _id: currentMember._id })
                        if (findTeamMember) {
                            const notifications = findTeamMember.notifications
                            if (notifications?.length > 0) {
                                findTeamMember.notifications = [...findTeamMember.notifications, message]
                                console.log('Customer')
                                await findTeamMember.save()
                            } else {
                                findTeamMember.notifications = [message]
                                await findTeamMember.save()
                            }
                        }
                    }
                }
                return res.status(201).send({ message: 'Notifcations updated from Customer' })
            } else {
                throw new Error("Internal Server Error")
            }
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}

const updateChatMessage = async (req, res) => {
    const _id = req.params.id
    const userId = req.params.userId
    if (!_id) {
        return res.status(402).send({ message: 'ID not found' })
    }
    try {
        const user = await User.findById(_id)
        const user1 = await User.findById(_id).lean()
        if (user) {
            let arr = [...user1.notifications]
            const currentObj = arr[userId]
            const obj = { ...currentObj, view: false }
            arr.splice(userId, 1, obj)
            user.notifications = [...arr]
            const array = await user.save()
            return res.status(200).send({ msgArray: arr })
        } else { 
            return res.status(404).send({ message: 'No user found' })
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}
const getUserNotifications = async (req, res) => {
    const _id = req.params.id
    if (!_id) {
        return res.status(402).send({ message: 'ID not found' })
    }
    try {
        const user = await User.findById(_id)
        if (user) {
            const { name, email, _id, is_active, created_at, roles, verified, phone_no, avatar, company_profile, notifications } = user
            const allNotifications = notifications?.length > 0 ? notifications : []
            return res.status(200).json({ userDetails: { name, email, id: _id, is_active, created_at, roles, verified, phone_no, avatar, company_profile, notifications: allNotifications }, message: "get user notifcations successfully" });
        } else {
            return res.status(404).send({ message: 'No user found' })
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = { postMessageToOtherMembers, getUserNotifications, updateChatMessage }