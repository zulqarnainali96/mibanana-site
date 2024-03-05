const { v4: uniqeID } = require('uuid')

const getValue = (data, id) => {
    const { project_title, name, user, project_id, } = data
    let obj = {
        unique_key: uniqeID(),
        id: id ? id : '',
        type: 'new-project',
        project_title,
        project_id,
        user,
        name,
        role: 'Customer',
        msg: `created a new project`,
        view: true,
    }
    return obj
}

const getStatusChange = (data, role, id, msg, status) => {
    const { _id, user, name, project_title } = data
    let obj = {
        id : id ? id : '',
        unique_key: uniqeID(),
        type: 'status-change',
        project_title,
        project_id: _id,
        status,
        user,
        name,
        role,
        msg: `${msg}`,
        view: true,
    }
    return obj
}

module.exports = { getValue, getStatusChange }