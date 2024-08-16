import { groupChatSchema } from "Schema/Index";
import apiClient from "api/apiClient";
import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react"

const useEditGroupForm = (reduxState, formData, onClose, openErrorSB, openSuccessSB, setRespMessage, setReload) => {
    const [loading, setLoading] = useState(false)
    const [autoListOpen, setAutoListOpen] = useState(false)
    const [options, setOptions] = useState([]);
    const teamLoading = autoListOpen && options.length === 0;
    const [selectedOptions, setSelectedOptions] = useState([])


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
            const filterList = data.list.filter(item => { return item._id !== reduxState.userDetails?.id })

            setOptions(filterList)
        } else {
            setOptions([])
        }
    }

    const handleEditForm = async (values, { resetForm }) => {
        setLoading(true)
        const postData = {
            ...values,
            participant: selectedOptions,
            group_admin: reduxState.userDetails?.name,
        }
        try {
            const { data, status } = await apiClient.put(`/api/update-group-setting/${formData._id}`, postData)
            if (status === 200) {
                onClose()
                setRespMessage(data.message)
                setReload(prev => !prev)
                setTimeout(() => {
                    openSuccessSB()
                }, 400)
                resetForm()
            }
            setLoading(false)
        }
        catch (err) {
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
            setLoading(false)
        }
    }
    const {
        values,
        errors,
        handleSubmit,
        handleChange,
        setValues,
        handleBlur,
        touched,
    } = useFormik({
        initialValues,
        validationSchema: groupChatSchema,
        onSubmit: handleEditForm
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

    useEffect(() => {
        setValues({
            group_name: formData.group_name,
            group_description: formData.group_description
        })
        let arr = [...formData.participant]
        const findUser = arr.find(item => item._id === reduxState.userDetails?.id)
        if (findUser) {
            const i = arr?.indexOf(findUser)
            const newUser = {
                ...findUser,
                name: 'You',
            }
            arr.splice(i, 1, newUser);
            setSelectedOptions(arr);
        } else {
            setSelectedOptions(formData.participant)
        }
    }, [formData])

    return {
        loading,
        initialValues,
        values,
        errors,
        handleSubmit,
        handleChange,
        handleBlur,
        touched,
        textAreaStyles,
        autoListOpen,
        setAutoListOpen,
        teamLoading,
        selectedOptions,
        setSelectedOptions,
        options,

    }
}

export default useEditGroupForm