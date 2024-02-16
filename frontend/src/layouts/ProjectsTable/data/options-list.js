import { Menu } from '@mui/material'
import React from 'react'
import MenuItemDropdown from './MenuItem'

const AuthMembersList = (props) => {
    const {item, loading4, loading5, projectAttend, projectForReview } = props
    
    return (
        <React.Fragment>
            <MenuItemDropdown loading={loading5} disabled={loading5} onClick={projectAttend} title="Ongoing" />
            <MenuItemDropdown loading={loading4} disabled={loading4} onClick={projectForReview} title="For Review" />
        </React.Fragment>
    )
}
const CustomerList = (props) => {
    const {item, loading1, loading2, loading3, projectCancel, duplicateProject, projectCompleted } = props

    const getActionsDisabled = () => {
        let result = false
        if(item.status === 'Project manager') result = true
        // else if(item.status === 'Ongoing') result = true
        // else if(item.status === 'Assigned') result = true
        // else if(item.status === 'Completed') result = true
        // else if(item.status === 'Cancel') result = true
        return result 
    }
    const getCancelDisabled = () => {
        let disabled = false
        if(item.status === 'Completed') disabled = true
        else if(item.status === 'Ongoing') disabled = true
        // else if(item.status === 'Assigned') disabled = true
        return disabled
    }
    return (
        <React.Fragment>
            <MenuItemDropdown loading={loading3} disabled={loading3 || getActionsDisabled}  onClick={projectCompleted} title="Completed" />
            <MenuItemDropdown loading={loading2} disabled={loading2} onClick={duplicateProject} title="Duplicate" />
            <MenuItemDropdown loading={loading1} disabled={loading1} onClick={projectCancel} title="Cancel" />
        </React.Fragment>
    )
}


const OptionsList = (props) => {
    const {item, children, handleMenuOpen, anchorEl, handleMenuClose, role, loading1, loading2, loading3, loading4, loading5, projectAttend, projectCancel, duplicateProject, projectCompleted, projectForReview, renderErrorSB, renderSuccessSB, } = props

    const customer_props = {item, loading1, loading2, loading3, projectCancel, duplicateProject, projectCompleted }
    const auth_member_list = {item, loading4, loading5, projectAttend, projectForReview }

    return (
        <React.Fragment>
            <div onClick={handleMenuOpen}>
                <svg xmlns="http://www.w3.org/2000/svg" className="active-svg" width="27" height="27" fill="none"><path stroke="inherit" stroke-linecap="round" stroke-linejoin="round" d="M21 11a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM6 11A5 5 0 1 0 6 1a5 5 0 0 0 0 10ZM21 26a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM6 26a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" /></svg>
            </div>
            {children ? children :
                <Menu
                    id="dropdown-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "center"
                    }}
                >
                    {role?.customer ? (
                        <CustomerList {...customer_props} />) : <AuthMembersList {...auth_member_list} />}

                    {renderSuccessSB}
                    {renderErrorSB}
                </Menu>
            }
        </React.Fragment>
    )
}

export default OptionsList
