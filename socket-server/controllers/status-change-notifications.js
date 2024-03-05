const User = require("../models/user-login");

const updateAndSendingStatusNotifications = async (data, project) => {
    console.log('Online Changing Status')
    try {
        const project_creator = await User.findById({ _id: project.user })
        if (project_creator) {
            if (project_creator.project_notifications?.length > 0) {
                project_creator.project_notifications = [...project_creator.project_notifications, data]
                await project_creator.save()
            } else {
                project_creator.project_notifications = [data]
                await project_creator.save()
            }
        }
    } catch (err) {
        console.log(err)
    }
}

const sendingNotificationsToDesigner = async (data, _id) => {
    try {
        const team_member = await User.findById(_id)
        if (team_member) {
            if (team_member.project_notifications?.length > 0) {
                team_member.project_notifications = [...team_member.project_notifications, data]
                await team_member.save()
            } else {
                team_member.project_notifications = [data]
                await team_member.save()
            }
        }
    } catch (err) {
        throw err
    }
}

const sendingNotificationsCurrentManager = async (data, _id) => {
    try {
        const manager = await User.findById(_id)
        if (manager) {
            if (manager.project_notifications?.length > 0) {
                manager.project_notifications = [...manager.project_notifications, data]
                await manager.save()
            } else {
                manager.project_notifications = [data]
                await manager.save()
            }
        }
    } catch (err) {
        throw err
    }
}


module.exports = { updateAndSendingStatusNotifications, sendingNotificationsToDesigner, sendingNotificationsCurrentManager }