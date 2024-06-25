import React, { useEffect, useState } from 'react'
import apiClient from 'api/apiClient'

const useMibananaTeam = (reduxState) => {
    const [mobileDevList, setMobileDevList] = useState([])
    const [graphicDesignerList, setGraphicDesignerList] = useState([])
    const [copyWriterList, setCopyWriterList] = useState([])
    const [webDeveloperList, setWebDeveloperList] = useState([])
    const [socialMediaManagerList, setSocialMediaManagerList] = useState([])
    const [openSingleChat, setOpenSingleChat] = useState(false)
    const [singleChat, setSingleChat] = useState({})
    const user_id = reduxState?.userDetails?.id
    const username = reduxState?.userDetails?.name
    const user_avatar = reduxState?.userDetails?.avatar

    const handleSingleChat = (item) => {
        if (item._id === user_id) {
            alert('You can not chat with yourself')
            return
        }
        setOpenSingleChat(true)
        setSingleChat(item)
    }
    const closeSingleChat = () => {
        setOpenSingleChat(false)
        // setSingleChat({})
    }


    const getGraphicDesignerList = async () => {
        await apiClient.get(`/api/get-team-member-list/graphic-design`)
            .then(({ data }) => {
                setGraphicDesignerList(data?.list)
            })
            .catch((e) => {
            });
    }
    const getMobileAppDevList = async () => {
        await apiClient.get(`/api/get-team-member-list/mobile-app-development`)
            .then(({ data }) => {
                setMobileDevList(data?.list)
            })
            .catch((e) => {
            });
    }
    const getCopyWriterList = async () => {
        await apiClient.get(`/api/get-team-member-list/copy-writing`)
            .then(({ data }) => {
                setCopyWriterList(data?.list)
            })
            .catch((e) => {
            });
    }
    const getSocialMediaManagerList = async () => {
        await apiClient.get(`/api/get-team-member-list/social-media-manager`)
            .then(({ data }) => {
                setSocialMediaManagerList(data?.list)
            })
            .catch((e) => {
            });
    }
    const getWebDeveloperList = async () => {
        await apiClient.get(`/api/get-team-member-list/web-app`)
            .then(({ data }) => {
                setWebDeveloperList(data?.list)
            })
            .catch((e) => {
            });
    }

    useEffect(() => {
        getGraphicDesignerList()
        getMobileAppDevList()
        getCopyWriterList()
        getSocialMediaManagerList()
        getWebDeveloperList()
    }, [])

    return {
        mobileDevList,
        graphicDesignerList,
        copyWriterList,
        webDeveloperList,
        socialMediaManagerList,
        openSingleChat,
        handleSingleChat,
        closeSingleChat,
        user_avatar,
        username,
        singleChat,
        user_id,
    }
}

export default useMibananaTeam
