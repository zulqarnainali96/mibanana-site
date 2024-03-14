import { TRIGER_NOTIFICATIONS } from "redux/actions/actions"
import { STATUS_NOTIFICATIONS } from "redux/actions/actions"
import { PROJECT_NOTIFICATIONS } from "redux/actions/actions"
import { USER_CHAT_MESSAGE } from "redux/actions/actions"
import { USER_DETAILS, SHOW_MODAL, PROJECT_CATEGORY, CUSTOMER_BRAND, NEW_BRAND, STATUS, IS_ALERT, CUSTOMER_PROJECTS, USER_AVATAR_URL, PROJECT_ID, IS_EDIT_BRAND, OPEN_BRAND_MODAL, RIGHTSIDEDRAWER, CURRENT_INDEX, RE_RENDER_CHAT, NON_ACTIVE_CUSTOMER, TOGGLE_CHATS } from "redux/actions/actions"

const initialState = {
    userDetails: {},
    isModalShow: false,
    statuses: [
        "All",
        "Archived",
        "Cancelled",
        "Project manager",
        "Completed",
        "Ongoing",
        "For Review",
        "Draft",
        "Heads Up!",
    ],
    category: [
        "Graphic Design",
        "Copywriting",
        "Illustration",
        "Video Editing",
        "Motion Graphic",
        "Web Development",
        "Voice Over",
        "Social Media Management Lite",
    ],
    brand: [
        "Nike",
        "Puma",
        "Ides",
        "Chen one"
    ],
    project_cat: "",
    project_list: [],
    user_avatar: "",
    project_ID: 0,
    isStatus: "",
    isAlert: false,
    new_brand: false,
    customerBrand: [],
    iseditBrand: false,
    openBrandModel: false,
    rightSideDrawer: { right: false },
    currentIndex: null,
    re_render_chat: false,
    userNewChatMessage: [],
    trigerNotifcations: false,
    non_active_customer_data: [],
    toogle_chats: false,
    project_notifications: [],
    status_notifications: [],

}
const UserReducers = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case USER_DETAILS:
            return {
                ...state,
                userDetails: payload
            }
        case SHOW_MODAL: {
            return {
                ...state,
                isModalShow: payload
            }
        }
        case PROJECT_CATEGORY: {
            return {
                ...state,
                project_cat: payload
            }
        }
        case CUSTOMER_PROJECTS: {
            return {
                ...state,
                project_list: payload
            }
        }
        case USER_AVATAR_URL: {
            return {
                ...state,
                user_avatar: payload
            }
        }
        case PROJECT_ID: {
            return {
                ...state,
                project_ID: payload
            }
        }
        case IS_ALERT: {
            return {
                ...state,
                isAlert: payload
            }
        }
        case STATUS: {
            return {
                ...state,
                isStatus: payload
            }
        }
        case NEW_BRAND: {
            return {
                ...state,
                new_brand: payload
            }
        }
        case CUSTOMER_BRAND: {
            return {
                ...state,
                customerBrand: payload
            }
        }
        case IS_EDIT_BRAND: {
            return {
                ...state,
                iseditBrand: payload
            }
        }
        case OPEN_BRAND_MODAL: {
            return {
                ...state,
                openBrandModel: payload
            }
        }
        case RIGHTSIDEDRAWER: {
            return {
                ...state,
                rightSideDrawer: payload
            }
        }
        case CURRENT_INDEX: {
            return {
                ...state,
                currentIndex: payload
            }
        }
        case RE_RENDER_CHAT: {
            return {
                ...state,
                re_render_chat: payload
            }
        }
        case USER_CHAT_MESSAGE: {
            return {
                ...state,
                userNewChatMessage: Array.isArray(payload) ? payload : [...state.userNewChatMessage, payload]
            }
        }
        case TRIGER_NOTIFICATIONS: {
            return {
                ...state,
                trigerNotifcations: payload
            }
        }
        case NON_ACTIVE_CUSTOMER: {
            return {
                ...state,
                non_active_customer_data: payload
            }
        }
        case TOGGLE_CHATS: {
            return {
                ...state,
                toogle_chats: payload
            }
        }
        case PROJECT_NOTIFICATIONS: {
            if (Array.isArray(payload)) {
                // API call returns array
                return {
                    ...state,
                    project_notifications: [...payload]
                }

            } else {
                // Socket returns single object 
                return {
                    ...state,
                    project_notifications: [payload, ...state.project_notifications]
                }
            }
        }
        case STATUS_NOTIFICATIONS: {
            return {
                ...state,
                status_notifications: payload
            }
        }
        default:
            return state
    }
}
export default UserReducers
