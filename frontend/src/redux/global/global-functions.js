// GET PROJECT DATA THAT ARE CREATED BY CUSTOMER

import apiClient from "api/apiClient"
import { getDate } from "./table-date";
import discordMusic from "assets/sound/discord.mp3";

const toggleDrawer = (anchor, open, setState, state) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }
  setState({ ...state, [anchor]: open });
};

// function convertCreatedAtToDate(createdAt) {
//   const [time, date] = createdAt.split(" ");
//   const [hours, minutes, seconds] = time.split(":");
//   const [day, month, year] = date.split("-");

//   // JavaScript months are 0-indexed, so subtract 1 from the month
//   const t = new Date(`${year}-${month - 1}-${day}T${hours}:${minutes}:${seconds}`)
//   return new Date(`${year}-${month - 1}-${day}T${hours}:${minutes}:${seconds}`);
// }

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
    else if (roles?.includes("Copy-Writer")) {
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

const getUserRoles = (role) => {
  if (role?.designer) return "Graphic-Designer";
  else if (role?.projectManager) return "Project-Manager";
  else if (role?.mobile_app_developer) return "Mobile-App-Developer";
  else if (role?.web_developer) return "Web-Developer";
  else if (role?.social_media_manager) return "Social-Media-Manager";
  else if (role?.copywriter) return "Copy-Writer";
  else if (role?.customer) return "Customer";
  else if (role?.admin) return "Admin";
};

const getProjectById = (id, callback, category, setFileVersionList) => {
  apiClient.get(`/api/get-project-by/${category}/${id}`)
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
  if (project_category === 'mobile-app-development') { return true }
  else if (project_category === 'web-app') { return true }
  else if (project_category === 'copy-writing') { return true }
  else if (project_category === 'social-media-manager') { return true }
  else if (project_category === 'website-development') { return true }
}
const getForReviewApiAccordingToProject = (category, id) => {
  if (category === 'mobile-app-development') {
    return `/api/mobile-app/for-review/${id}`
  }
  else if (category === 'Graphic Design' || category === 'graphic-design') {
    return `/api/for-review-project/${id}`
  }
  else if (category === 'social-media-manager') {
    return `/api/social-media/for-review/${id}`
  }
  else if (category === 'copy-writing') {
    return `/api/copy-writer/for-review/${id}`
  }
  else if (category === 'web-app') {
    return `/api/web-app/for-review/${id}`
  }
  else if (category === 'website-development') {
    return `/api/website/for-review/${id}`
  }
}
const getWithRevisionApiAccordingToProject = (category, id) => {
  if (category === 'mobile-app-development') {
    return `/api/mobile-app/with-revision/${id}`
  }
  else if (category === 'Graphic Design' || category === 'graphic-design') {
    return `/api/with-revision/${id}`
  }
  else if (category === 'social-media-manager') {
    return `/api/social-media/with-revision/${id}`
  }
  else if (category === 'copy-writing') {
    return `/api/copy-writer/with-revision/${id}`
  }
  else if (category === 'web-app') {
    return `/api/web-app/with-revision/${id}`
  }
  else if (category === 'website-development') {
    return `/api/website/with-revision/${id}`
  }
}
const getCompletedApiAccordingToProject = (category, id) => {
  if (category === 'mobile-app-development') {
    return `/api/mobile-app/completed/${id}`
  }
  else if (category === 'Graphic Design' || category === 'graphic-design') {
    return `/api/project-completed/${id}`
  }
  else if (category === 'social-media-manager') {
    return `/api/social-media/completed/${id}`
  }
  else if (category === 'copy-writing') {
    return `/api/copy-writer/completed/${id}`
  }
  else if (category === 'web-app') {
    return `/api/web-app/completed/${id}`
  }
  else if (category === 'website-development') {
    return `/api/website/completed/${id}`
  }
}
const getOngoingApiAccordingToProject = (category, id) => {
  if (category === 'mobile-app-development') {
    return `/api/mobile-app/ongoing/${id}`
  }
  else if (category === 'Graphic Design' || category === 'graphic-design') {
    return `/api/attend-project/${id}`
  }
  else if (category === 'social-media-manager') {
    return `/api/social-media/ongoing/${id}`
  }
  else if (category === 'copy-writing') { 
    return `/api/copy-writer/ongoing/${id}`
  }
  else if (category === 'web-app') {
    return `/api/web-app/ongoing/${id}`
  }
  else if (category === 'website-development') {
    return `/api/website/ongoing/${id}`
  }
}
const getDeleteApiAccordingToProject = (category, id) => {
  if (category === 'mobile-app-development') {
    return `/api/mobile-app/delete-project/${id}`
  }
  else if (category === 'Graphic Design' || category === 'graphic-design') {
    return `/graphic-project/${id}`
  }
  else if (category === 'social-media-manager') {
    return `/api/social-media/delete-project/${id}`
  }
  else if (category === 'copy-writing') {
    return `/api/copy-writer/delete-project/${id}`
  }
  else if (category === 'web-app') {
    return `/api/web-app/delete-project/${id}`
  }
  else if (category === 'website-development') {
    return `/api/website/delete-project/${id}`
  }
}
const getDuplicateApiAccordingToProject = (category, id) => {
  if (category === 'mobile-app-development') {
    return `/api/mobile-app/duplicate-project/${id}`
  }
  else if (category === 'Graphic Design' || category === 'graphic-design') {
    return `/api/duplicate-project/${id}`
  }
  else if (category === 'social-media-manager') {
    return `/api/social-media/duplicate-project/${id}`
  }
  else if (category === 'copy-writing') {
    return `/api/copy-writer/duplicate-project/${id}`
  }
  else if (category === 'web-app') {
    return `/api/web-app/duplicate-project/${id}`
  }
  else if (category === 'website-development') {
    return `/api/website/duplicate-project/${id}`
  }
}
const getCancelApiAccordingToProject = (category, id) => {
  if (category === 'mobile-app-development') {
    return `/api/mobile-app/cancel/${id}`
  }
  else if (category === 'Graphic Design' || category === 'graphic-design') {
    return `/api/cancel-project/${id}`
  }
  else if (category === 'social-media-manager') {
    return `/api/social-media/cancel/${id}`
  }
  else if (category === 'copy-writing') {
    return `/api/copy-writer/cancel/${id}`
  }
  else if (category === 'web-app') {
    return `/api/web-app/cancel/${id}`
  }
  else if (category === 'website-development') {
    return `/api/website/cancel/${id}`
  }
}
const getProjectCategory = (category) => {
  if (category === 'mobile-app-development') {
    return "Mobile App Development"
  }
  else if (category === 'Graphic Design' || category === 'graphic-design') {
    return "Graphic Design"
  }
  else if (category === 'social-media-manager') {
    return "Social Media Manager"
  }
  else if (category === 'copy-writing') {
    return "CopyWriting"
  }
  else if (category === 'web-app') {
    return "Web App"
  }
  else if (category === 'website-development') {
    return "Website Development"
  }
}

const makeTaskPriorityHigh = async (data, setRespMessage, openSuccessSB, openErrorSB, projectCallback, id, setProject, category, setFileVersionList) => {
  await apiClient.post("/api/set-project-priority", data)
    .then(({ data }) => {
      setRespMessage(data.message)
      getProjectById(id, setProject, category, setFileVersionList)
      setTimeout(() => {
        openSuccessSB()
      }, 500)
    })
    .catch((err) => {
      setRespMessage(err.response.data.message)
      openErrorSB()
    })
}

const handleRole = (role) => {
        if (role?.designer || role?.mobile_app_developer || role?.web_developer || role?.social_media_manager || role?.copywriter) {
            return {
                teamMember: true
            }
        }
        else if (role?.projectManager) {
            return { projectManager: true }
        }
        else if (role?.customer) {
            return { customer: true }
        }
        else if (role?.admin) {
            return { admin: true }
        }
    }

const notificationSound = () => {
  const audio = new Audio(discordMusic);
  audio.play();
}


export { getProjectData, showFilesModal, getBrandData, toggleDrawer, currentUserRole, projectStatus, getProjectById, projectNotifications, projecStatusNotifications, getSingleProjectById, openProjectByFormType, getUserRoles, getForReviewApiAccordingToProject, getWithRevisionApiAccordingToProject, getOngoingApiAccordingToProject, getCancelApiAccordingToProject, getDuplicateApiAccordingToProject, getDeleteApiAccordingToProject, getCompletedApiAccordingToProject, getProjectCategory, handleRole, makeTaskPriorityHigh, notificationSound }