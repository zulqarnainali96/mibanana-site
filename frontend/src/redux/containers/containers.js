import { connect } from "react-redux";
import { reduxFunctions } from "redux/actions/actions";


const mapStateToProps = (state) => ({
    reduxState: {
        userDetails: state.userDetails,
        statuses: state.statuses,
        category: state.category,
        brand: state.brand,
        isModalShow: state.isModalShow,
        project_cat: state.project_cat,
        project_list: state.project_list,
        user_avatar: state.user_avatar,
        project_ID: state.project_ID,
        isStatus: state.isStatus,
        isAlert: state.isAlert,
        new_brand: state.new_brand,
        customerBrand: state.customerBrand,
        openBrandModel: state.openBrandModel,
        re_render_chat: state.re_render_chat,
        trigerNotifcations: state.trigerNotifcations,
        non_active_customer_data: state.non_active_customer_data,
        project_notifications: state.project_notifications,
        status_notifications: state.status_notifications,
        currentProjectId: state.currentProjectId,
        edit_project: state.edit_project,
        project_call: state.project_call,
        onlineUser: state.onlineUser,
    }
})

const mapDispatchToProps = (dispatch) => ({
    reduxActions: {
        getUserDetails: (payload) => dispatch(reduxFunctions.getUserDetails(payload)),
        showModal: (payload) => dispatch(reduxFunctions.showModal(payload)),
        getProject: (payload) => dispatch(reduxFunctions.getProject(payload)),
        getCustomerProject: (payload) => dispatch(reduxFunctions.getCustomerProject(payload)),
        getUserAvatarUrl: (payload) => dispatch(reduxFunctions.getUserAvatarUrl(payload)),
        getID: (payload) => dispatch(reduxFunctions.getID(payload)),
        setProjectStatus: (payload) => dispatch(reduxFunctions.setProjectStatus(payload)),
        setAlert: (payload) => dispatch(reduxFunctions.setAlert(payload)),
        getCustomerBrand: (payload) => dispatch(reduxFunctions.getCustomerBrand(payload)),
        getNew_Brand: (payload) => dispatch(reduxFunctions.getNew_Brand(payload)),
        openBrandModalFunc: (payload) => dispatch(reduxFunctions.openBrandModalFunc(payload)),
        getUserNewChatMessage: (payload) => dispatch(reduxFunctions.getUserNewChatMessage(payload)),
        reRenderChatComponent: (payload) => dispatch(reduxFunctions.reRenderChatComponent(payload)),
        trigeringNotifications: (payload) => dispatch(reduxFunctions.trigeringNotifications(payload)),
        getNonActiveCustomerData: (payload) => dispatch(reduxFunctions.getNonActiveCustomerData(payload)),
        handleProject_notifications: (payload) => dispatch(reduxFunctions.handleProject_notifications(payload)),
        handleStatusProject_notifications: (payload) => dispatch(reduxFunctions.handleStatusProject_notifications(payload)),
        handle_OpenEditProject: (payload) => dispatch(reduxFunctions.handle_OpenEditProject(payload)),
        handle_CurrentProjectId: (payload) => dispatch(reduxFunctions.handle_CurrentProjectId(payload)),
        handleGetAllProjects: (payload) => dispatch(reduxFunctions.handleGetAllProjects(payload)),
        handleOnlineUsers: (payload) => dispatch(reduxFunctions.handleOnlineUsers(payload)),
    }
})

function reduxContainer(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component)
}

export default reduxContainer