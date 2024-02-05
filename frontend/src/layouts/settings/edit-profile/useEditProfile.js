import apiClient from 'api/apiClient'
import { useEffect, useState } from 'react'
import defaultImage from "assets/mi-banana-icons/default-profile.png"

const useEditProfile = ({ openSuccessSB, openErrorSB, reduxActions, reduxState }) => {
    const [loading, setLoading] = useState(false)
    const [profileData, setProfileData] = useState({
        fullName: '', email: '', phone: '', user_avatar: ''
    })
    const [respMessage, setRespMessage] = useState("")
    const [profileImage, setProfileImage] = useState([])
    const [imageUrl, setImageUrl] = useState(defaultImage);

    const handleChange = (event) => {
        const { name, value } = event.target
        setProfileData({
            ...profileData,
            [name]: value
        })
    }
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfileImage([file])
            const reader = new FileReader();

            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
        }
    };

    async function uploadWithProfile() {
        setLoading(true)
        const formData = new FormData
        formData.append('email', profileData.email)
        formData.append('phone_no', profileData.phone)
        formData.append('fullname', profileData.fullName)
        formData.append('file', profileImage[0])

        const id = reduxState.userDetails.id
        await apiClient.post('/api/user/profile/' + id, formData)
            .then(({ data }) => {
                const { message, profileData } = data
                setRespMessage(message)
                setProfileData({ ...profileData })

                localStorage.setItem('user_details', JSON.stringify({
                    ...reduxState.userDetails,
                    ...profileData,
                }))
                reduxActions.getUserDetails({
                    ...reduxState.userDetails,
                    ...profileData
                })
                setImageUrl(profileData?.avatar)
                setLoading(false)
                setProfileImage([])
                setProfileData()
                setTimeout(() => {
                    openSuccessSB()
                }, 800)
            })
            .catch(err => {
                if (err.response) {
                    const { message } = err.response.data
                    setRespMessage(message)
                    setLoading(false)
                    setTimeout(() => {
                        openErrorSB()
                    }, 800)
                    return
                }
                setRespMessage(err.message)
                setLoading(false)
                setTimeout(() => {
                    openErrorSB()
                }, 800)
            })

    }
    async function uploadWithoutProfile() {
        setLoading(true)
        const data = {
            email: profileData.email,
            phone_no: profileData.phone,
            fullname: profileData.fullName
        }
        const id = reduxState.userDetails.id
        await apiClient.post('/api/user/no-profile/' + id, data)
            .then(({ data }) => {
                const { message, profileData } = data
                setRespMessage(message)
                localStorage.setItem('user_details', JSON.stringify({
                    ...reduxState.userDetails,
                    ...profileData,
                }))
                reduxActions.getUserDetails({
                    ...reduxState.userDetails,
                    ...profileData,
                })
                setLoading(false)
                setTimeout(() => {
                    openSuccessSB()
                }, 800)
            })
            .catch(err => {
                if (err.response) {
                    const { message } = err.response.data
                    setRespMessage(message)
                    setLoading(false)
                    setTimeout(() => {
                        openErrorSB()
                    }, 800)
                    return
                }
                setRespMessage(err.message)
                setLoading(false)
                setTimeout(() => {
                    openErrorSB()
                }, 800)
            })

    }
    async function UpdateProfile(event) {
        event.preventDefault()
        if (profileImage.length) {
            uploadWithProfile()
        } else {
            uploadWithoutProfile()
        }
    }
    const handlePhoneChange1 = (phone) => {
        setProfileData({
            ...profileData,
            phone: phone
        })
    }
    useEffect(() => {
        function getProfile() {
            const { email, name: fullName, phone_no: phone, avatar: user_avatar } = reduxState.userDetails
            setProfileData({ email, fullName, phone, user_avatar })
            if (user_avatar?.length) {
                setImageUrl(user_avatar)
            }
        }
        getProfile()
    }, [])

    return { respMessage, loading, imageUrl, profileData, profileImage, handlePhoneChange1, UpdateProfile, handleFileUpload, handleChange }

}

export default useEditProfile
