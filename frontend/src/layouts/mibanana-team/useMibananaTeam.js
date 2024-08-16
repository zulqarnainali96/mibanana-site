import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import apiClient from 'api/apiClient'
// import { SocketContext } from 'sockets'
import { currentUserRole } from 'redux/global/global-functions'
import { handleRole } from 'redux/global/global-functions'
import { useSocket } from 'sockets'

const useMibananaTeam = (reduxState, reduxActions) => {
    const [teamMemberList, setTeamMemberList] = useState([])
    const [loading, setLoading] = useState(false)
    const [singleChat, setSingleChat] = useState(null)
    const [filter, setFilter] = useState('');
    const user_id = reduxState?.userDetails?.id
    const username = reduxState?.userDetails?.name
    const user_avatar = reduxState?.userDetails?.avatar
    // const socketIO = useRef(useContext(SocketContext));
    const socketIO = useSocket();
    const [create_form_open, setCreate_Form_Open] = useState(false)
    const role = currentUserRole(reduxState)
    const [allGroups, setAllGroups] = useState([])
    const [anchorEl, setAnchorEl] = useState(null);
    const currentUser = handleRole(role)
    const [isReload, setReload] = useState(false)

    const [respMessage, setRespMessage] = useState("")
    const [successSB, setSuccessSB] = useState(false)
    const [errorSB, setErrorSB] = useState(false)

    const openSuccessSB = () => setSuccessSB(true)
    const openErrorSB = () => setErrorSB(true)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const closeChat = () => setSingleChat(null)

    const handleSingleChat = (item) => {
        setAnchorEl(null);
        if (item.hasOwnProperty('group_name')) {
            setSingleChat(item)
            socketIO.emit('join-room', item._id)
        } else {
            const userOnline = reduxState.onlineUser?.find(user => user.id === item._id)
            if (userOnline) {
                setSingleChat({ ...item, socketID: userOnline.socketID, status: userOnline.status })
                socketIO.emit('join-room', item._id)
            } else {
                setSingleChat(item)
            }
        }
    }
    const handleOpenForm = () => {
        setCreate_Form_Open(true)
    }
    const handleCloseForm = () => {
        setCreate_Form_Open(false)
    }

    const getTeamMemberList = async () => {
        setLoading(true)
        await apiClient.get(`/api/get-team-member-list`)
            .then(({ data }) => {
                const filterCurrrentUser = data?.list.filter(item => item._id !== user_id).map(item => {
                    return {
                        ...item,
                        type: 'single'
                    }
                })
                setTeamMemberList(filterCurrrentUser)
                setLoading(false)
            })
            .catch((e) => {
                if (e.response) {
                    const { message } = e.response.data
                    setRespMessage(message)
                    setTimeout(() => {
                        openErrorSB()
                    }, 500)
                } else {
                    setRespMessage(e.message)
                    setTimeout(() => {
                        openErrorSB()
                    }, 500)
                }
                setLoading(false)
            });
    }

    const getAllGroups = async () => {
        await apiClient.get(`/api/all-groups`)
            .then(({ data }) => {
                const groups = data.all_groups.map(g => {
                    return {
                        ...g,
                        type: 'group'
                    }
                })
                setAllGroups(groups)
            })
            .catch((err) => {
                if (err.response) {
                    const { message } = err.response.data
                    setRespMessage(message)
                    setTimeout(() => {
                        openErrorSB()
                    }, 500)
                } else {
                    setRespMessage(err.message)
                    setTimeout(() => {
                        openErrorSB()
                    }, 500)
                }
            });
    }
    const getGroupsById = async () => {
        await apiClient.get(`/api/get-groups-by-id/${user_id}`)
            .then(({ data }) => {
                const groups = data.all_groups.map(g => {
                    return {
                        ...g,
                        type: 'group'
                    }
                })
                setAllGroups(groups)
            })
            .catch((err) => {
                if (err.response) {
                    const { message } = err.response.data
                    setRespMessage(message)
                    setTimeout(() => {
                        openErrorSB()
                    }, 500)
                } else {
                    setRespMessage(err.message)
                    setTimeout(() => {
                        openErrorSB()
                    }, 500)
                }
            });
    }
    const handleGroups = () => {
        if (role.projectManager || role?.admin) {
            getAllGroups()
        } else if (currentUser?.teamMember) {
            getGroupsById()
        }
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
        const filterTeamMemberUnreadMessage = reduxState.unread_chat_message?.filter(item => {
            if (item?.type === 'group-chat') {
                return item._id !== userId
            } else {
                return item.sender !== userId
            }
        })
        reduxActions.handleUnreadChatMessage(filterTeamMemberUnreadMessage)
    };

    const sortTeamMembers = useCallback(() => {
        const sortedMembers = [...teamMemberList, ...allGroups].sort((a, b) => {
          const lastMessageA = reduxState.unread_chat_message.find(msg => 
            msg.type === 'group-chat' ? msg._id === a._id : msg.sender === a._id
          );
          const lastMessageB = reduxState.unread_chat_message.find(msg => 
            msg.type === 'group-chat' ? msg._id === b._id : msg.sender === b._id
          );
      
          if (!lastMessageA && !lastMessageB) return 0;
          if (!lastMessageA) return 1;
          if (!lastMessageB) return -1;
      
          return new Date(lastMessageB.date) - new Date(lastMessageA.date);
        });
      
        return sortedMembers;
      }, [teamMemberList, allGroups, reduxState.unread_chat_message]);
      


    useEffect(() => {
        getTeamMemberList()
        handleGroups()
    }, [isReload])

    return {
        handleSingleChat,
        resetUnreadMessages,
        handleOpenForm,
        handleCloseForm,
        handleClick,
        handleClose,
        anchorEl,
        closeChat,
        loading,
        user_avatar,
        username,
        singleChat,
        user_id,

        errorSB,
        setErrorSB,
        respMessage,
        successSB,
        setSuccessSB,
        openSuccessSB,
        openErrorSB,
        setRespMessage,
        currentUser,
        
        handleFilterChange,
        // filteredMembers: [...allGroups, ...filteredMembers],
        sortedTeamMembers: sortTeamMembers(),
        open: create_form_open,
        setReload,
        isReload,
        filter,
        role

    }
}

export default useMibananaTeam
