// GET PROJECT DATA THAT ARE CREATED BY CUSTOMER

import apiClient from "api/apiClient"

const toggleDrawer = (anchor, open, setState, state) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
    }
    setState({ ...state, [anchor]: open });
};

const getProjectData = (id, callback) => {
    apiClient.get("/graphic-project/" + id).then(({ data }) => {
        callback(data)
    }).catch(err => {
        console.error('err ===> ', err)
    })

}

const showFilesModal = (modalState, setModalState) => {
    setModalState(!modalState)
}

const getBrandData = async (id, callback) => {
    await apiClient.get("/api/brand/" + id)
        .then(({ data }) => {
            callback(data.brandList)
            // setBrand(data.brandList)
        })
        .catch(err => {
            if (err.response) {
                let { message } = err.response.data
                console.log('Message =>', message)
                // if (message) callback([])
            }
        })
}

const currentUserRole = (state) => {
    const roles = state?.userDetails?.roles;
    if (roles && Array.isArray(roles)) {
        if (roles?.includes("Project-Manager")) {
            return {
                projectManager: true,
                designer: false,
                customer: false,
                admin: false
            }
        }
        else if (roles?.includes("Graphic-Designer")) {
            return {
                projectManager: false,
                designer: true,
                customer: false,
                admin: false
            }
        }
        else if (roles?.includes("Customer")) {
            return {
                projectManager: false,
                designer: false,
                customer: true,
                admin: false
            }
        }
        else if (roles?.includes("Admin")) {
            return {
                projectManager: false,
                designer: false,
                customer: false,
                admin: true
            }
        }
    }
}


export { getProjectData, showFilesModal, getBrandData, toggleDrawer, currentUserRole }