import React from 'react'
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ChatMessageNo from 'examples/Sidenav/ChatMessageNo'
import UserOnlineIcon from './userOnlineicon'
import "../miBananaTeamMembers.css";

const MemberList = ({ allStates, onlineUsers, onlineWidth, member }) => {
    const { singleChat, handleSingleChat, filteredMembers, resetUnreadMessages } = allStates
    return (
        <ListItem disablePadding sx={{
            "&:focus-within": {
                backgroundColor: (filteredMembers?.some(member => member._id === singleChat?._id)) ? "rgba(149, 157, 165, 0.2) !important" : null,
            },
        }} onClick={() => handleSingleChat(member)}>
            <ListItemButton sx={onlineWidth(member)} onClick={() => resetUnreadMessages(member._id)}>
                <UserOnlineIcon member={member} data={onlineUsers} />
                <ListItemText
                    sx={{ position: 'relative' }}
                    primary={
                        <React.Fragment>
                            {member.name}
                            {"   "}
                            <ChatMessageNo memberId={member._id} />
                            <Typography
                                variant="body2"
                                component="div"
                                color="textSecondary"
                            >
                                {member.roles}
                            </Typography>
                        </React.Fragment>
                    }
                />
            </ListItemButton>
        </ListItem>
    )
}
const GroupList = ({ allStates, onlineUsers, onlineWidth, member, id }) => {
    const { singleChat, handleSingleChat, filteredMembers, resetUnreadMessages } = allStates
    return (
        <ListItem disablePadding sx={{
            "&:focus-within": {
                backgroundColor: (filteredMembers?.some(member => member._id === singleChat?._id)) ? "rgba(149, 157, 165, 0.2) !important" : null,
            }, 
        }} onClick={() => handleSingleChat(member)}>
            <ListItemButton onClick={() => resetUnreadMessages(member._id)}>
                <UserOnlineIcon member={member} data={onlineUsers} />
                <ListItemText
                    sx={{ position: 'relative' }}
                    primary={
                        <React.Fragment>
                            {member.group_name}
                            {"   "}
                            <ChatMessageNo memberId={member._id} />
                            <span className='groups'>{member?.type}</span>
                            <Typography
                                variant="body2"
                                component="div"
                                color="textSecondary"
                            >
                                {member.participant?.map((item,i) => <span key={i} style={{fontSize:'.9rem'}} >{item.name + ", " + "  "}</span>)}
                            </Typography>
                        </React.Fragment>
                    }
                />
        </ListItemButton>
        </ListItem >
    )
}

const FitlerTeamMembers = ({ allStates, onlineUsers, onlineWidth }) => {
    return (
        <React.Fragment>
            {
                allStates.filteredMembers.map((member, index) => (
                    <React.Fragment key={index}>
                        {member.type === 'single' ? (
                            <MemberList
                                key={member._id}
                                member={member}
                                allStates={allStates}
                                onlineUsers={onlineUsers}
                                onlineWidth={onlineWidth}
                            />
                        ) : (
                            <GroupList
                                key={member._id}
                                member={member}
                                allStates={allStates}
                                onlineUsers={onlineUsers}
                                onlineWidth={onlineWidth}
                            />
                        )}
                    </React.Fragment>
                ))
            }
        </React.Fragment>
    )
}

export default FitlerTeamMembers
