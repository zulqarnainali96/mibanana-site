// GET PROJECT DATA THAT ARE CREATED BY CUSTOMER

import apiClient from "api/apiClient"
import { getDate } from "./table-date";

const toggleDrawer = (anchor, open, setState, state) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
    }
    setState({ ...state, [anchor]: open });
};

function convertCreatedAtToDate(createdAt) {
    const [time, date] = createdAt.split(" ");
    const [hours, minutes, seconds] = time.split(":");
    const [day, month, year] = date.split("-");

    // JavaScript months are 0-indexed, so subtract 1 from the month
    const t = new Date(`${year}-${month - 1}-${day}T${hours}:${minutes}:${seconds}`)
    return new Date(`${year}-${month - 1}-${day}T${hours}:${minutes}:${seconds}`);
}

const getProjectData = (id, callback) => {
    apiClient.get("/graphic-project/" + id).then(({ data }) => {
        const filterProject = data?.CustomerProjects?.map(item => {
            const getSubmittedDate = getDate(item?.createdAt).formatedDate
            const getUpdatedDate = getDate(item?.updatedAt).formatedDate
            let obj = {}
            obj.createdAt = getSubmittedDate
            obj.updatedAt = getUpdatedDate
            return { ...item, ...obj }
        }).reverse()
        const project_data = {
            message: data?.message,
            CustomerProjects: filterProject
        }
        callback(project_data)
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