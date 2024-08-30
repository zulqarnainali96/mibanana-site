import React from 'react'
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ChatMessageNo from 'examples/Sidenav/ChatMessageNo'
import UserOnlineIcon from './userOnlineicon'
import "../miBananaTeamMembers.css";

const MemberList = ({ allStates, onlineUsers, onlineWidth, member, fullArray }) => {
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
                            <ChatMessageNo memberId={member._id} message_count={member.unread_messages_count} fullArray={fullArray} />
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
const GroupList = ({ allStates, onlineUsers, onlineWidth, member, id, fullArray }) => {
    const { singleChat, handleSingleChat, filteredMembers, resetUnreadMessages, user_id } = allStates
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
                            <ChatMessageNo memberId={member._id} message_count={member.unread_messages_count} fullArray={fullArray} />
                            <span className='groups'>{member?.type}</span>
                            <Typography
                                variant="body2"
                                component="div"
                                color="textSecondary"
                            >
                                {member.participant?.map((item, i) => <span
                                    key={i}
                                    style={{ fontSize: '.9rem' }}>
                                    {user_id === item._id ? 'You, ' : item.name + ", " + "  "}
                                </span>
                                )}
                            </Typography>
                        </React.Fragment>
                    }
                />
            </ListItemButton>
        </ListItem >
    )
}

const FitlerTeamMembers = ({ allStates, onlineUsers, onlineWidth, filter }) => {
    const membersToDisplay = filter
        ? allStates.sortedTeamMembers.filter(member => member.roles.includes(filter))
        : allStates.sortedTeamMembers;
    return (
        <React.Fragment>
            {membersToDisplay.map((member, index, fullArray) => (
                <React.Fragment key={index}>
                    {member.type === 'group' ? (
                        <GroupList
                            key={member._id}
                            member={member}
                            allStates={allStates}
                            onlineUsers={onlineUsers}
                            onlineWidth={onlineWidth}
                            fullArray={fullArray}
                        />
                    ) : (
                        <MemberList
                            key={member._id}
                            member={member}
                            allStates={allStates}
                            onlineUsers={onlineUsers}
                            onlineWidth={onlineWidth}
                            fullArray={fullArray}
                        />
                    )}
                </React.Fragment>
            ))
            }
        </React.Fragment>
    )
}

export default FitlerTeamMembers
