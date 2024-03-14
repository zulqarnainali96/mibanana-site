import React, { useCallback, useEffect, useMemo, useState } from 'react'

const useSocialMediaManager = (props) => {
    const { handleClose } = props
    const [selectService, setSelectService] = useState({
        contentCreation: false,
        postingSchedule: false,
        engagementStrategy: false,
        otherServiceType: false,
    })

    const [choosePlatform, setChoosePlatform] = useState({
        All: false,
        facebook: false,
        twitter: false,
        linkedin: false,
        otherMediaPlatform: false,
    })

    const [selectPlan, setSelectPlan] = useState({
        weekly: false,
        monthly: false,
        quarter: false,
        otherPlan: false,
    })

    const handleContent = (options) => (event) => {
        setSelectService({
            ...selectService,
            [options]: event.target.checked
        })
    }
    const handleChoosePlatform = (options) => (event) => {
        if (options === "All") {
            setChoosePlatform({
                All: event.target.checked,
                facebook: event.target.checked,
                twitter: event.target.checked,
                linkedin: event.target.checked,
                otherMediaPlatform: event.target.checked,
            })
        } else {
            setChoosePlatform({
                ...choosePlatform,
                [options]: event.target.checked
            })
        }
    }
    const handleSelectPlan = (options) => (event) => {
        setSelectPlan({
            ...selectPlan,
            [options]: event.target.checked
        })
    }

    const handleModalClose = () => {
        setSelectService({
            contentCreation: false,
            postingSchedule: false,
            engagementStrategy: false,
            otherServiceType: false,
        })
        setChoosePlatform({
            All: false,
            facebook: false,
            twitter: false,
            linkedin: false,
            otherMediaPlatform: false,
        })
        setSelectPlan({
            weekly: false,
            monthly: false,
            quarter: false,
            otherPlan: false,
        })
        handleClose()
    }

    useEffect(() => {
        return () => {
            console.log("unmount")
            setSelectService({
                contentCreation: false,
                postingSchedule: false,
                engagementStrategy: false,
                otherServiceType: false,
            })
            setChoosePlatform({
                All: false,
                facebook: false,
                twitter: false,
                linkedin: false,
                otherMediaPlatform: false,
            })
            setSelectPlan({
                weekly: false,
                monthly: false,
                quarter: false,
                otherPlan: false,
            })
        }
    }, [setSelectService])

    return {
        handleModalClose,
        handleContent,
        handleChoosePlatform,
        handleSelectPlan,
        selectService,
        choosePlatform,
        selectPlan
    }
}

export default useSocialMediaManager
