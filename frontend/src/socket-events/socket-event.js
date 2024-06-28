export const sendingStatusNotification = (socket, role, item, userId, status) => {
    if (role?.projectManager) {
        const manager = 'Project-Manager'
        return socket.current.emit('sending-status-change', item, manager, userId, status)
    } else if (role?.designer) {
        const designer = 'Graphic-Designer'
        return socket.current.emit('sending-status-change', item, designer, userId, status)
    } 
    else if (role?.mobile_app_developer) {
        const mobile_app_developer = 'Mobile-App-Developer'
        return socket.current.emit('sending-status-change', item, mobile_app_developer, userId, status)
    } 
    else if (role?.copywriter) {
        const copywriter = 'Copy-Writer'
        return socket.current.emit('sending-status-change', item, copywriter, userId, status)
    } 
    else if (role?.social_media_manager) {
        const social_media_manager = 'Social-Media-Manager'
        return socket.current.emit('sending-status-change', item, social_media_manager, userId, status)
    } 
    else if (role?.web_developer) {
        const web_developer = 'Web-Developer'
        return socket.current.emit('sending-status-change', item, web_developer, userId, status)
    } 
    else if (role?.admin) {
        const admin = 'Admin'
        return socket.current.emit('sending-status-change', item, admin, userId, status)
    }
}

export const customerSendingNotification = (socket, item, role, status) => {
    return socket.current.emit('customer-sending-notifications', item, role, status)
}