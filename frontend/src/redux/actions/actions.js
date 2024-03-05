export const USER_DETAILS = 'USER_DETAILS'
export const SHOW_MODAL = 'SHOW_MODAL'
export const PROJECT_CATEGORY = 'PROJECT_CATEGORY'
export const CUSTOMER_PROJECTS = 'CUSTOMER_PROJECTS'
export const USER_AVATAR_URL = 'USER_AVATAR_URL'
export const PROJECT_ID = 'PROJECT_ID'
export const IS_ALERT = 'IS_ALERT'
export const STATUS = 'STATUS'
export const NEW_BRAND = 'NEW_BRAND'
export const CUSTOMER_BRAND = 'CUSTOMER_BRAND'
export const IS_EDIT_BRAND = 'IS_EDIT_BRAND'
export const CURRENT_BRAND_ID = 'CURRENT_BRAND_ID'
export const OPEN_BRAND_MODAL = 'OPEN_BRAND_MODAL' 
export const RIGHTSIDEDRAWER = 'RIGHTSIDEDRAWER' 
export const CURRENT_INDEX = 'CURRENT_INDEX' 
export const RE_RENDER_CHAT = 'RE_RENDER_CHAT' 
export const USER_CHAT_MESSAGE = 'USER_CHAT_MESSAGE' 
export const TRIGER_NOTIFICATIONS = 'TRIGER_NOTIFICATIONS' 
export const NON_ACTIVE_CUSTOMER = 'NON_ACTIVE_CUSTOMER' 

export const getUserDetails = (payload) => ({
    type : USER_DETAILS,
    payload : payload
})

export const getProject = (payload) => ({
    type : PROJECT_CATEGORY,
    payload : payload
})

export const showModal = (payload) => ({
    type : SHOW_MODAL,
    payload : payload
})

export const getCustomerProject = (payload) => ({
    type : CUSTOMER_PROJECTS,
    payload : payload
})

export const getUserAvatarUrl = (payload) => ({
    type : USER_AVATAR_URL,
    payload : payload
})

export const getID = (payload) => ({
    type : PROJECT_ID,
    payload : payload
})

export const setAlert = (payload) => ({
    type : IS_ALERT,
    payload : payload
})

export const setProjectStatus = (payload) => ({
    type : STATUS,
    payload : payload
})

export const getNew_Brand = (payload) => ({
    type : NEW_BRAND,
    payload : payload
})

export const getCustomerBrand = (payload) => ({
    type : CUSTOMER_BRAND,
    payload : payload
})

export const openEditBrandModal = (payload) => ({
    type : IS_EDIT_BRAND,
    payload : payload
})
export const getCurrentBrandID = (payload) => ({
    type : CURRENT_BRAND_ID,
    payload : payload
}) 

export const openBrandModalFunc = (payload) => ({
    type : OPEN_BRAND_MODAL,
    payload : payload,
})

export const setRightSideBar = (payload) => ({
    type : RIGHTSIDEDRAWER,
    payload : payload
})

export const setCurrentIndex = (payload) => ({
    type : CURRENT_INDEX,
    payload : payload
})

export const reRenderChatComponent = (payload) => ({
    type : RE_RENDER_CHAT,
    payload : payload
})

export const getUserNewChatMessage = (payload) => ({
    type : USER_CHAT_MESSAGE,
    payload : payload
})

export const trigeringNotifications = (payload) => ({
    type : TRIGER_NOTIFICATIONS,
    payload : payload
})

export const getNonActiveCustomerData = (payload) => ({
    type : NON_ACTIVE_CUSTOMER,
    payload : payload
})
export const reduxFunctions = {
    getUserDetails,
    showModal,
    getProject,
    getCustomerProject,
    getUserAvatarUrl,
    setAlert,
    setProjectStatus,
    getNew_Brand,
    getCustomerBrand,
    openEditBrandModal,
    getCurrentBrandID,
    getID,
    openBrandModalFunc,
    setRightSideBar,
    setCurrentIndex,
    reRenderChatComponent,
    getUserNewChatMessage,
    trigeringNotifications,
    getNonActiveCustomerData,
} 

