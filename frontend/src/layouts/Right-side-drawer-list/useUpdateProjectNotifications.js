// import { useSocket } from 'sockets'
import React, { useContext, useEffect, useRef } from 'react'
import { projectNotifications } from 'redux/global/global-functions'
import { SocketContext } from 'sockets';

export const useUpdateProjectNotifications = (reduxActions, reduxState, project_notifications) => {
    // const socketIO = useRef(useSocket());
    const socketIO = useRef(useContext(SocketContext));


    const updatedNotifications = (unique_key) => {
        const id = reduxState.userDetails?.id
        socketIO.current.emit('update-current-notification', unique_key, id)
        socketIO.current.on('send-update-notification-status', (Ok) => {
            if (Ok) {
                const project_notif = project_notifications?.find(item => item.unique_key === unique_key);
                if (project_notif) {
                    console.log(project_notifications);
                    let arr = project_notifications.map(item =>
                        item.unique_key === unique_key ? { ...item, view: false } : item
                    );
                    console.log('Updated array:', arr);
                    reduxActions.handleProject_notifications(arr);
                } else {
                    console.log(`Notification with unique_key ${unique_key} not found`);
                }
                //         const project_notif = project_notifications?.find(item => item.unique_key === unique_key)
                //         console.log(project_notifications)
                //         let arr = [...project_notifications]
                //         const findIndex = arr.indexOf(project_notif)
                //         const obj = { ...project_notif, view: false }
                //         console.log('Index ',findIndex)
                //         arr.splice(findIndex, 1, obj)
                //         console.log('Delete object ',arr)
                //         // reduxActions.handleProject_notifications(arr)
            }
        })

    }
    
    const deleteNotification = (id) => {
        const user_id = reduxState.userDetails?.id
        socketIO.current.emit('delete-current-notification', id, user_id)
        socketIO.current.on('confirmation-delete-notification', (done) => {
            if (done) {
                const deleteNotification = project_notifications?.filter(item => item.unique_key !== id)
                reduxActions.handleProject_notifications(deleteNotification)
            }
        })
    }

    useEffect(() => {
    }, [reduxState.project_notifications])
    return {
        updatedNotifications,
        deleteNotification,
    }
}