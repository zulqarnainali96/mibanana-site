import { Menu, MenuItem, MenuList, useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { fontsFamily } from 'assets/font-family'
import { mibananaColor } from 'assets/new-images/colors'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MDTypography from 'components/MDTypography'
import React from 'react'
import { MoonLoader } from 'react-spinners'
import ChatList from './components/ChatList'
import imageAvatar from "assets/mi-banana-icons/default-profile.png";
import SendOutlined from '@mui/icons-material/SendOutlined';
import { reactQuillStyles2 } from 'assets/react-quill-settings/react-quill-settings';
import ReactQuill from 'react-quill'
import { formats } from 'assets/react-quill-settings/react-quill-settings'
import { modules } from 'assets/react-quill-settings/react-quill-settings'
import ProjectChanges from 'layouts/chats/Chat-container/project-changes'

const basicStyle = { display: "flex", alignItems: "center" }

const ProjectChat = (props) => {
    const is500 = useMediaQuery("(max-width:500px)")
    const { userId, chatContainerRef, withRevision, handleRole, handleClick, anchorEl, loading, id, handleClose, projectForReview, projectOngoing, msgArray, onSendMessage, sendMessage, avatar, message, makePriorityHigh, role, project } = props

    const classes = reactQuillStyles2()
    const chatTitle = ({ palette: { primary } }) => ({
        fontFamily: fontsFamily.poppins,
        color: mibananaColor.tableHeaderColor,
        fontWeight: "bold",
        fontSize: is500 ? "14px !important" : "16px",
        paddingBottom: "5px",
        borderBottom: `2px solid ${mibananaColor.tableHeaderColor}`,
        display: "flex",
    })
    return (
        <React.Fragment >
            {/* <MDTypography
                sx={chatTitle}
                variant="h4"
                pb={1}
            >
                <Grid xs={6} style={basicStyle}>Activity</Grid>
                {handleRole().teamMember || handleRole().projectManager ? (
                    <Grid
                        id="dropdown-btn"
                        aria-controls={anchorEl ? 'dropdown-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={anchorEl ? 'true' : undefined}
                        onClick={handleClick}
                        item
                        xs={6}
                        sx={{ display: "flex", justifyContent: "end", alignItems: "center", cursor: "pointer", color: '#333' }}
                    >
                        Change Status
                        <MoreVertIcon fontSize='small' />
                    </Grid>
                ) : null}
                {handleRole().customer && (
                    <MDBox display="flex" justifyContent="flex-end" alignItems="center" width="100%" onClick={() => withRevision(id)}>
                        <MDButton
                            type="submit"
                            color="warning"
                            endIcon={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <MoonLoader loading={loading} size={18} color='#121212' />
                            </div>}
                            disabled={loading}
                            boxShadow="none"
                            sx={{
                                color: '#000 !important',
                                textTransform: "capitalize",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: '12px'
                            }}
                        >
                            Send Changes to Designer
                        </MDButton>
                    </MDBox>
                )}
                <Menu
                    id="dropdown-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    style={{ top: "10px" }}
                >
                    <MenuList>
                        {handleRole().teamMember ? (
                            <div>
                                <MenuItem onClick={projectOngoing}>Ongoing</MenuItem>
                                <MenuItem onClick={projectForReview}>For Review</MenuItem>
                            </div>
                        ) : handleRole().projectManager ? (
                            <div>
                                <MenuItem onClick={projectOngoing}>Ongoing</MenuItem>
                                <MenuItem onClick={projectForReview}>For Review</MenuItem>
                                <MenuItem onClick={makePriorityHigh}>Make High Priority</MenuItem>
                            </div>
                        ) : null}
                    </MenuList>
                </Menu>
            </MDTypography> */}
            <ProjectChanges
                handleClick={handleClick}
                withRevision={withRevision}
                anchorEl={anchorEl}
                handleClose={handleClose}
                projectAttend1={projectOngoing}
                projectForReview1={projectForReview}
                userRole={role}
                is500={is500}
                userId={userId}
                project_id={id}
                loading={loading}
                makePriorityHigh={makePriorityHigh}
                project_user={project.user}
            />
            <Grid
                ref={chatContainerRef}
                container
                justifyContent={"space-between"}
                alignItems={"flex-start"}
                flexDirection={"column"}
                sx={gridStyle2}
            >
                <h1 className='h1-style'>CHAT</h1>
                <Grid item xxl={12} xl={12} lg={12} width={"100%"}>
                    <Box className="chat" >
                        {msgArray?.map((item, index) => (
                            <ChatList key={index} index={index} chats={item} _is500={is500} userId={userId} />
                        ))}
                    </Box>
                </Grid>
            </Grid>
            <Box
                width="98%"
                m='auto'
                mt={0}
                p={1}
                sx={inputBoxStyle}
            >
                <Box sx={{ display: is500 ? "none" : 'block' }}>
                    <img
                        src={avatar ? avatar : imageAvatar}
                        width={is500 ? 34 : 50}
                        height={is500 ? "auto" : 50}
                        alt="person-image"
                    />
                </Box>
                <ReactQuill
                    theme="snow"
                    value={message}
                    onChange={(value) => sendMessage(value)}
                    modules={modules}
                    formats={formats}
                    className={classes.quill}
                    style={{ width: is500 ? '97%' : '87%' }}
                />
                <SendOutlined
                    fontSize="medium"
                    sx={sendIconStyle}
                    onClick={onSendMessage}
                />
            </Box>
        </React.Fragment>
    )
}

const inputBoxStyle = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    position: "absolute",
    paddingBlock: '10px',
    left: "0",
    bottom: "0px",
    gap: '15px',
    backgroundColor: mibananaColor.headerColor
}

const gridStyle2 = {
    height: "86%",
    overflowY: "scroll",
    "::-webkit-scrollbar": {
        width: "10px",
        height: "0",
    },
    "::-webkit-scrollbar-thumb": {
        backgroundColor: "#888",
        borderRadius: 2
    },
}
const sendIconStyle = {
    position: "absolute",
    right: 20,
    top: 54,
    fill: 'rgba(0,0,0,0.7)',
    cursor: "pointer",
}

export default ProjectChat
