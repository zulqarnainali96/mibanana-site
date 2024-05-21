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

const orderOfStatus = ['For Review', 'Ongoing', 'Assigned', 'Project manager', 'Completed', 'Revision', 'Cancel'];

function sortByStatus(arr) {
  return arr.sort((a, b) => {
    const statusA = a.status;
    const statusB = b.status;

    // Get the index of each status in the orderOfStatus array
    const indexA = orderOfStatus.indexOf(statusA);
    const indexB = orderOfStatus.indexOf(statusB);

    // Compare the indexes to determine the sort order
    return indexA - indexB;
  });
}

const getProjectData = (id, callback) => {
  apiClient.get("/graphic-project/" + id).then(({ data }) => {
    let filterProject = data?.CustomerProjects?.map(item => {
      const getSubmittedDate = getDate(item?.createdAt).formatedDate
      const getUpdatedDate = getDate(item?.updatedAt).formatedDate
      let obj = {}
      obj.createdAt = getSubmittedDate
      obj.updatedAt = getUpdatedDate
      return { ...item, ...obj }
    }).reverse()
    filterProject = sortByStatus(filterProject)
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
        mobile_app_developer: false,
        copywriter: false,
        web_developer: false,
        social_media_manager: false,
        customer: false,
        admin: false
      }
    }
    else if (roles?.includes("Graphic-Designer")) {
      return {
        projectManager: false,
        designer: true,
        mobile_app_developer: false,
        copywriter: false,
        web_developer: false,
        social_media_manager: false,
        customer: false,
        admin: false
      }
    }
    else if (roles?.includes("Mobile-App-Developer")) {
      return {
        projectManager: false,
        designer: false,
        mobile_app_developer: true,
        copywriter: false,
        web_developer: false,
        social_media_manager: false,
        customer: false,
        admin: false
      }
    }
    else if (roles?.includes("CopyWriter")) {
      return {
        projectManager: false,
        designer: false,
        mobile_app_developer: false,
        copywriter: true,
        web_developer: false,
        social_media_manager: false,
        customer: false,
        admin: false
      }
    }
    else if (roles?.includes("Web-Developer")) {
      return {
        projectManager: false,
        designer: false,
        mobile_app_developer: false,
        copywriter: false,
        web_developer: true,
        social_media_manager: false,
        customer: false,
        admin: false
      }
    }
    else if (roles?.includes("Social-Media-Manager")) {
      return {
        projectManager: false,
        designer: false,
        mobile_app_developer: false,
        copywriter: false,
        web_developer: false,
        social_media_manager: true,
        customer: false,
        admin: false
      }
    }

    else if (roles?.includes("Customer")) {
      return {
        projectManager: false,
        designer: false,
        mobile_app_developer: false,
        copywriter: false,
        web_developer: false,
        social_media_manager: false,
        customer: true,
        admin: false
      }
    }
    else if (roles?.includes("Admin")) {
      return {
        projectManager: false,
        designer: false,
        mobile_app_developer: false,
        copywriter: false,
        web_developer: false,
        social_media_manager: false,
        customer: false,
        admin: true
      }
    }
  }
}

const getProjectById = (id, callback, setFileVersionList) => {
  apiClient.get("/api/get-project-by/" + id)
    .then(({ data }) => {
      callback(data.project)
      setFileVersionList(data.project?.version)
    })
    .catch(err => {
      if (err.response) {
        let { message } = err.response.data
        console.log('Message =>', message)
      }
    })
}

const getSingleProjectById = (id, callback, status) => {
  apiClient.get("/api/get-project-by/" + id)
    .then(({ data }) => {
      const projects = data.project.map(item => {
        if (item._id === id) {
          return { ...item, status: status }
        }
        return item
      })
      callback(projects)
    })
    .catch(err => {
      if (err.response) {
        console.log('Message =>', err.response.data.message)
      }
    })
}

const projectStatus = (status) => {
  switch (status) {
    case "Project manager":
      return "Project manager";
    case "Completed":
      return "Completed";
    case "Ongoing":
      return "Ongoing";
    case "HeadsUp":
      return "HeadsUp";
    case 'Assigned':
      return "Assigned"
    case 'Cancel':
      return "Cancelled"
    case "For Review":
      return "For Review";
    case "Submitted":
      return "Submitted";
    case "With Revision":
      return "With Revision";
    default:
      return "End";
  }
}

const projectNotifications = async (id, callback) => {
  await apiClient.get("/api/project-notifications/" + id)
    .then(({ data }) => {
      const reverseArray = data.project_notifications?.reverse()
      callback(reverseArray)
    })
    .catch((err) => {
      console.log(err);
    });
};

const projecStatusNotifications = async (id, callback) => {
  await apiClient.get("/project-status-notifications/" + id)
    .then(({ data }) => {
      const reverseArray = data.project_notifications?.reverse()
      callback(reverseArray)
    })
    .catch((err) => {
      console.log(err);
    });
};

const openProjectByFormType = (project_category) => {
  console.log(project_category)
  if (project_category === 'mobile-app-development') { return true }
  else if (project_category === 'web-app') { return true }
  else if (project_category === 'copy-writing') { return true }
  else if (project_category === 'social-media-manager') { return true }
  else if (project_category === 'website-development') { return true }
}


export { getProjectData, showFilesModal, getBrandData, toggleDrawer, currentUserRole, projectStatus, getProjectById, projectNotifications, projecStatusNotifications, getSingleProjectById, openProjectByFormType }