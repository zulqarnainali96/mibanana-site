export const sendingStatusNotification = (socket, role, item, userId, status) => {
    if (role?.projectManager) {
        const manager = 'Project-Manager'
        return socket.current.emit('sending-status-change', item, manager, userId, status)
    } else if (role?.designer) {
        const designer = 'Graphic-Designer'
        return socket.current.emit('sending-status-change', item, designer, userId, status)
    } else if (role?.admin) {
        const admin = 'Graphic-Designer'
        return socket.current.emit('sending-status-change', item, admin, userId, status)
    }
}

export const customerSendingNotification = (socket, item, role, status) => {
    return socket.current.emit('customer-sending-notifications', item, role, status)
}