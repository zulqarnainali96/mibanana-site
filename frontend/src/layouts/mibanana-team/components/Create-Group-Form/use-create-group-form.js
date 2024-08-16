import { groupChatSchema } from "Schema/Index";
import apiClient from "api/apiClient";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react"
import { useSocket } from "sockets";

const useCreateGroupForm = (reduxState, onClose, openSuccessSB, openErrorSB, setRespMessage, setReload) => {
    const [loading, setLoading] = useState(false)
    const [autoListOpen, setAutoListOpen] = useState(false)
    const [options, setOptions] = useState([]);
    const teamLoading = autoListOpen && options.length === 0;
    const [selectedOptions, setSelectedOptions] = useState([])
    const socketIO = useSocket()

    const initialValues = {
        group_name: '',
        group_description: '',
    };
    function sleep(duration) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, duration);
        });
    }
    async function getTeamList() {
        const { data, status } = await apiClient.get('/api/get-team-member-list')
        if (status === 200) {
            const filterList = data.list.filter(item => item._id !== reduxState.userDetails?.id)
            setOptions(filterList)
        } else {
            setOptions([])
        }
    }

    const handleGroupForm = async (values, { resetForm }) => {
        if (selectedOptions.length === 0) return
        const userData = {
            _id: reduxState.userDetails?.id,
            name: reduxState.userDetails?.name,
            email: reduxState?.userDetails.email,
            avatar: reduxState?.userDetails.avatar,
            roles: reduxState?.userDetails.roles,
        }
        setLoading(true)
        const postData = {
            ...values,
            participant: [...selectedOptions, userData],
            group_admin: reduxState.userDetails?.name,
            admin_id: userData._id,
        }
        try {
            const { data, status } = await apiClient.post('/api/create-group-chat', postData)
            if (status === 201) {
                setLoading(false)
                resetForm()
                setSelectedOptions([])
                onClose()
                setRespMessage(data.message)
                // console.log(data)
                socketIO.emit('new-group-notification', data.participant, data.groupData)
                setTimeout(() => {
                    openSuccessSB()
                }, 400)
                setReload(prev => !prev)
            }
        }
        catch (err) {
            setLoading(false)
            if (err.response) {
                const { message } = err.response.data
                setRespMessage(message)
                setTimeout(() => {
                    openErrorSB()
                }, 400)
            } else {
                setRespMessage(err.message)
                setTimeout(() => {
                    openErrorSB()
                }, 400)
            }
        }

    }
    const {
        values,
        errors,
        handleSubmit,
        handleChange,
        handleBlur,
        touched,
        setFieldValue
    } = useFormik({
        initialValues,
        validationSchema: groupChatSchema,
        onSubmit: handleGroupForm
    });
    const textAreaStyles = {
        height: '117px',
        overflow: 'hidden',
        width: '100%',
        borderRadius: '5px',
        borderColor: '#ccc',
        outline: 'none',
        fontFamily: '"Poppins", sans-serif',
        paddingBlock: '12px',
        paddingInline: '12px',
    }
    useEffect(() => {
        let active = true;

        if (!teamLoading) {
            return undefined;
        }

        (async () => {
            await sleep(1e3); // For demo purposes.

            if (active) {
                getTeamList()
            }
        })();

        return () => {
            active = false;
        };


    }, [teamLoading])

    useEffect(() => {
        if (!autoListOpen) {
            setOptions([]);
        }
    }, [autoListOpen]);

    return {
        loading,
        initialValues,
        values,
        errors,
        handleSubmit,
        handleChange,
        handleBlur,
        touched,
        setFieldValue,
        textAreaStyles,
        autoListOpen,
        setAutoListOpen,
        teamLoading,
        selectedOptions,
        setSelectedOptions,
        options,
    }
}

export default useCreateGroupForm