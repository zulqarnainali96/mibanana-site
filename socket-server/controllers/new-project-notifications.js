const user = require('../models/user-login');

const UpdateProjectNotifications = async (data) => {
    console.log('online')
    // try {
    //     const currentUser = await user.findById({ _id: data.id })
    //     if (currentUser) {
    //         if (currentUser.project_notifications?.length > 0) {
    //             currentUser.project_notifications = [...currentUser.project_notifications, data]
    //             await currentUser.save()
    //         } else {
    //             currentUser.project_notifications = [data]
    //             await currentUser.save()
    //         }
    //     }
    // } catch (err) {
    //     console.log(err)
    // }
    try {
        const users = await user.find()
        if (users) {
            for (let a = 0; a < users.length; a++) {
                const currentUser = users[a];
                if (currentUser?.roles.includes('Project-Manager')) {
                    const findSingleManager = await user.findById({ _id: currentUser._id })
                    if (findSingleManager) {
                        if (findSingleManager.project_notifications?.length > 0) {
                            findSingleManager.project_notifications = [...findSingleManager.project_notifications, data]
                            await findSingleManager.save()
                        } else {
                            findSingleManager.project_notifications = [data]
                            await findSingleManager.save()
                        }
                    }
                } else {
                    console.log('not working')
                }
            }
        }
    } catch (err) {
        console.log(err)
    }
}

const UpdateWithoutOnline = async (data) => {
    console.log('not online')
    try {
        const users = await user.find()
        if (users) {
            // const filterManager = connectedUser.filter(user => {
            //     return user.role?.includes('Project-Manager')
            // })  

            // Use the method in future
            
            for (let a = 0; a < users.length; a++) {
                const currentUser = users[a];
                if (currentUser?.roles.includes('Project-Manager')) {
                    const findSingleManager = await user.findById({ _id: currentUser._id })
                    if (findSingleManager) {
                        if (findSingleManager.project_notifications?.length > 0) {
                            findSingleManager.project_notifications = [...findSingleManager.project_notifications, { ...data, id: findSingleManager._id }]
                            await findSingleManager.save()
                        } else {
                            findSingleManager.project_notifications = [{ ...data, id: findSingleManager._id }]
                            await findSingleManager.save()
                        }
                    }
                } else {
                    console.log('not working')
                }
            }
        }
    } catch (err) {
        console.log(err)
    }
}

const updateCurrentNotificationsStatus = async (unique_key, user_id) => {
    try {
        const users = await user.findById({ _id: user_id });
        if (users) {
            const project_notif = users?.project_notifications.find(item => item.unique_key === unique_key)
            if (project_notif) {
                let arr = users.project_notifications.map(item =>
                    item.unique_key === unique_key ? { ...item, view: false } : item
                );
                users.project_notifications = arr
                // let arr = [...users.project_notifications]
                // const findIndex = arr.indexOf(project_notif)
                // const obj = { ...project_notif, view: false }
                // arr.splice(findIndex, 1, obj)
                // users.project_notifications = [...arr]
                const save = await users.save()
                if (save) return true
            } else {
                return false
            }
        } else {
            return false
        }
    } catch (error) {
        console.log(error.message);
        return false
    }

};

const handleNotificationDelete = async (id, user_id) => {
    try {
        const currentUser = await user.findById(user_id)
        if (currentUser) {
            let user_notification = [...currentUser.project_notifications]
            user_notification = user_notification.filter(item => item.unique_key !== id)
            currentUser.project_notifications = user_notification
            const done = await currentUser.save()
            if (done) {
                return true
            }
        } else {
            return false
        }
    } catch (err) {
        return false
    }
}

module.exports = { UpdateProjectNotifications, UpdateWithoutOnline, updateCurrentNotificationsStatus, handleNotificationDelete }