import React, { useContext, useEffect, useRef, useState } from 'react'
import apiClient from 'api/apiClient'
import { SocketContext } from 'sockets'

const useGroupChat = (reduxState, reduxActions) => {
    const [teamMemberList, setTeamMemberList] = useState([])
    const [loading, setLoading] = useState(false)
    const [openSingleChat, setOpenSingleChat] = useState(false)
    const [singleChat, setSingleChat] = useState(null)
    const [filter, setFilter] = useState('');
    const user_id = reduxState?.userDetails?.id
    const username = reduxState?.userDetails?.name
    const user_avatar = reduxState?.userDetails?.avatar
    const socketIO = useRef(useContext(SocketContext));

    const handleSingleChat = (item) => {
        const userOnline = reduxState.onlineUser?.find(user => user.id === item._id)
        if (userOnline) {
            setSingleChat({ ...item, socketID: userOnline.socketID, status: userOnline.status })
            socketIO.current.emit('join-room', item._id)
        } else {
            setSingleChat(item)
        }
    }
    const closeSingleChat = () => {
        setOpenSingleChat(false)
        // setSingleChat({})
    }

    const countUnreadMessages = (messages, teamMembers) => {
        // Create a map to store unread message counts for each sender
        const unreadCounts = {};
        if (messages?.length > 0) {

            messages.forEach(msg => {
                const { sender } = msg;
                if (msg.view) { // Only consider messages with view: true
                    if (unreadCounts[sender]) {
                        unreadCounts[sender]++;
                    } else {
                        unreadCounts[sender] = 1;
                    }
                }
            });

            // Map the team members and add the unread_message property
            const updatedTeamMembers = teamMembers.map(member => {
                return {
                    ...member,
                    unread_message: unreadCounts[member._id] || 0
                };
            });
            return updatedTeamMembers;
        } else {
            return teamMembers
        }
    };

    const getTeamMemberList = async () => {
        setLoading(true)
        await apiClient.get(`/api/get-team-member-list`)
            .then(({ data }) => {
                const filterCurrrentUser = data?.list.filter(item => item._id !== user_id)
                // const updatedTeamMembers = countUnreadMessages(reduxState.unread_chat_message, filterCurrrentUser);
                // console.log(updatedTeamMembers)
                setTeamMemberList(filterCurrrentUser)
                setLoading(false)
            })
            .catch((e) => {
                setLoading(false)
                console.log(e.message)
            });
    }
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };
    const filteredMembers = filter ? teamMemberList.filter(member => member.roles.includes(filter)) : teamMemberList;

    const resetUnreadMessages = (userId) => {
        // Map the team members and reset the unread_message property for the specific user
        const updatedTeamMembers = teamMemberList.map(member => {
            if (member._id === userId) {
                return {
                    ...member,
                    unread_message: 0
                };
            }
            return member;
        });
        setTeamMemberList(updatedTeamMembers)
        const filterTeamMemberUnreadMessage = reduxState.unread_chat_message?.filter(item => item.sender !== userId)
        reduxActions.handleUnreadChatMessage(filterTeamMemberUnreadMessage)
    };

    useEffect(() => {
        getTeamMemberList()
    }, [])

    return {
        handleSingleChat,
        closeSingleChat,
        resetUnreadMessages,
        loading,
        user_avatar,
        username,
        singleChat,
        user_id,
        handleFilterChange,
        filteredMembers,
        filter
    }
}

export default useGroupChat
