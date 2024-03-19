import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import React, { useEffect, useState } from 'react'
import reduxContainer from 'redux/containers/containers'
import { useUpdateProjectNotifications } from './useUpdateProjectNotifications'
import { fontsFamily } from 'assets/font-family'
import { IconButton } from '@mui/material'
import { Delete, } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const ProjectNotification = (props) => {
    const { project_notifications, reduxActions, reduxState } = props
    const [chatMessage, setChatMessage] = useState(project_notifications)
    
    const { updatedNotifications, deleteNotification } = useUpdateProjectNotifications(reduxActions, reduxState, project_notifications)
    const navigate = useNavigate()

    const onChangeProjectView = (item) => {
        updatedNotifications(item.unique_key)
        setTimeout( () => {
            navigate("/chat/" + item?.project_id)
        },150)
    }
    const onChangeScreenToChats = (item) => {
        navigate("/chat/" + item?.project_id)
    }

    useEffect(() => {
        setChatMessage(project_notifications)
    }, [project_notifications])

    return (
        <MDBox
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            width="95%"
            paddingInline="5px"
        >

            {chatMessage?.map((item,i) => (
                <MDBox
                    key={i}
                    bgColor={item.view ? '#e8e8e1' : '#f5f5e794'}
                    sx={{ cursor: "pointer" }}
                    margin="8px 0px"
                    paddingBlock="10px"
                    paddingInline='10px'
                    shadow={"xl"}
                    border="1px solid #e1e1ce"
                    position="relative"
                    onClick={() => item.view ? onChangeProjectView(item) : onChangeScreenToChats(item)}
                >
                    {item.view && (<MDTypography
                        variant="span"
                        sx={{
                            backgroundColor: "#f44335",
                            borderRadius: '10px',
                            width: '14px',
                            height: '14px',
                            borderRadius: '20px',
                            display: 'block',
                            position: 'absolute',
                            top: '-7px',
                            left: '-6px'
                        }}
                    >
                    </MDTypography>)}
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(item.unique_key)
                        }}

                        sx={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-16px',
                            zIndex: '99'
                        }}>
                        <Delete
                            sx={{
                                fill: "#f44335",
                            }}
                        />
                    </IconButton>
                    <MDTypography
                        variant="span"
                        color="error"
                        fontSize="small"
                        sx={{
                            fontFamily: "Poppins",
                            fontWeight: '600'
                        }}
                    >
                        {`(${item.role})`}
                    </MDTypography>
                    <MDTypography
                        variant="body2"
                        color="text"
                        sx={{
                            fontSize: "14px !important",
                            fontFamily: "Poppins",
                            whiteSpace: 'break-spaces'
                        }}

                    >
                        {item?.type === 'new-project' ? `${item.name} ${item.msg}` : `${item.msg}`}
                    </MDTypography>
                    <MDTypography
                        variant="body2"
                        color="text"
                        sx={{
                            fontSize: "14px !important",
                            fontFamily: "Poppins",
                            fontWeight: '600'
                        }}
                    >
                        Title: {item.project_title}
                    </MDTypography>
                </MDBox>
            ))}
            {chatMessage?.length === 0 && <MDTypography variant="h6" pt={4} sx={{ fontFamily: fontsFamily.poppins, fontWeight: 'bold' }} textAlign="center">No Notifcations Found</MDTypography>}
        </MDBox>
    )
}

export default reduxContainer(ProjectNotification)
