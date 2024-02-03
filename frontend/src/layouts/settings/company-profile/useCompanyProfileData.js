import apiClient from 'api/apiClient'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export const useCompanyProfileData = ({ openSuccessSB, openErrorSB }) => {
    const [respMessage, setRespMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const companyName = useSelector(state => state.userDetails.company_profile)
    const id = useSelector(state => state.userDetails?.id)

    const [companyData, setCompanyData] = useState({
        company_name: '', contact_person: '', company_size: '', primary_email: '', primary_phone: '',
        time_zone: '', company_address: ''
    })

    const handleChange = (event) => {
        const { name, value } = event.target
        setCompanyData({
            ...companyData,
            [name]: value
        })
    }

    const handleSignUp = (event) => {
        event.preventDefault()
        setLoading(true)
        let data = companyData
        data.id = id
        apiClient.post("/settings/company-profile", data)
            .then(resp => {
                if (resp.status === 200 || resp.status === 201) {
                    setRespMessage(resp.data?.message)
                    setLoading(false)
                    setTimeout(() => {
                        openSuccessSB()
                    }, 400)
                } else {
                    setRespMessage(resp.data?.message)
                    setLoading(false)
                    setTimeout(() => {
                        openErrorSB()
                    }, 400)
                }
            })
            .catch(e => {
                setLoading(false)
                setRespMessage(e.response?.data?.message)
                setTimeout(() => {
                    openErrorSB()
                }, 400)
            })

    }

    const getProfileDetails = async () => {
        await apiClient.get("/settings/company-profile/" + id)
            .then(resp => {
                setCompanyData({ ...resp?.data?.company_data })
            })
            .catch(e => {
            })
    }
    const handlePhoneChange1 = (phone) => {
        companyData({
            ...companyData,
            primary_phone: phone
        })
    }

    useEffect(() => {
        getProfileDetails()
        setCompanyData({
            ...companyData,
            company_name: companyName ? companyName : ''
        })
    }, [])

    return { respMessage, companyData, handleChange, handlePhoneChange1, handleSignUp, loading, }
}


