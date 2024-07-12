import React, { useContext, useEffect, useRef, useState } from 'react'
import apiClient from 'api/apiClient'
import { SocketContext } from 'sockets'

const useMibananaTeam = (reduxState) => {
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
        // setOpenSingleChat(true)
        setSingleChat(item)
        socketIO.current.emit('join-private-chat', item._id)
        socketIO.current.emit('join-private-chat', user_id)
    }
    const closeSingleChat = () => {
        setOpenSingleChat(false)
        // setSingleChat({})
    }

    const getTeamMemberList = async () => {
        setLoading(true)
        await apiClient.get(`/api/get-team-member-list`)
            .then(({ data }) => {
                const filterCurrrentUser = data?.list.filter(item => item._id !== user_id)
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

    useEffect(() => {
        getTeamMemberList()
    }, [])

    return {
        handleSingleChat,
        closeSingleChat,
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

export default useMibananaTeam
