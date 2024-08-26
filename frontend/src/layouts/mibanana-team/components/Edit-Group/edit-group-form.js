import { CloseOutlined } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, Grid, useMediaQuery, Input, TextField } from '@mui/material';
import { styled } from '@mui/styles';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import React from 'react'
import { MoonLoader } from 'react-spinners';
import { submitButtonStyle } from 'examples/Navbars/mobile-app-dev-form/mobile-app-dev-form';
import AutoList from './components/AutoList';
import useEditGroupForm from './use-edit-group-form';
import MDInput from 'components/MDInput';
import { GroupDetails } from './components/GroupDetails';


const GroupForm = styled(Dialog)(({ theme: { breakpoints } }) => ({
    '& .MuiPaper-root': {
        maxWidth: '60% !important',
        width: "100% !important",
        [breakpoints.down('lg')]: {
            width: '95%'
        },
    },
    '& .MuiInputBase-root': {
        paddingBlock: '15px'
    },
    '& .MuiDialogContent-root': {
        padding: '16px',
    },
    '& .MuiDialogActions-root': {
        padding: '8px',
        width: "100%"
    },
}));

const EditGroupChat = ({ reduxState, open, onClose, data, openErrorSB, openSuccessSB, setRespMessage, setReload, userId }) => {
    const smallScreen = useMediaQuery("(max-width:768px)");

    const {
        loading,
        autoListOpen,
        values,
        errors,
        options,
        handleSubmit,
        handleChange,
        teamLoading,
        setAutoListOpen,
        handleBlur,
        formData,
        textAreaStyles,
        touched,
        selectedOptions,
        setSelectedOptions,
    } = useEditGroupForm(reduxState, data, onClose, openErrorSB, openSuccessSB, setRespMessage, setReload);


    return (
        <GroupForm open={open}>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {userId === data.admin_id ? (
                    <MDTypography>
                        Edit Group
                    </MDTypography>
                ) : (
                    <MDTypography>
                        View Group
                    </MDTypography>
                )}
                <MDButton onClick={onClose} sx={{ position: "absolute", right: 4 }}>
                    <CloseOutlined />
                </MDButton>
            </DialogTitle>
            {userId === data.admin_id ? (
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xxl={6} xl={6} lg={6} sm={12} xs={12}>
                                <MDTypography variant="h6" pb={1} className="copywriting-title">
                                    Group Name
                                </MDTypography>
                                <TextField
                                    fullWidth
                                    sx={{ "& > .MuiInputBase-root": { paddingBlock: '7px !important' } }}
                                    placeholder='Type your Group Name'
                                    id='group_name'
                                    name='group_name'
                                    value={values.group_name}
                                    type='text'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    touched={touched.group_name}
                                    error={errors.group_name}
                                    helperText={errors.group_name}
                                />
                            </Grid>
                            <Grid item xxl={6} xl={6} lg={6} sm={12} xs={12}>
                                <MDTypography variant={"h6"} pb={1} className="copywriting-title">
                                    Select Participants
                                </MDTypography>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <AutoList
                                            setAutoListOpen={setAutoListOpen}
                                            autoListOpen={autoListOpen}
                                            teamLoading={teamLoading}
                                            options={options}
                                            formData={formData}
                                            selectedOptions={selectedOptions}
                                            setSelectedOptions={setSelectedOptions}
                                            reduxState={reduxState}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <MDTypography variant={"h6"} pb={1} className="copywriting-title">
                                    Group Descriptions
                                </MDTypography>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <TextareaAutosize
                                            style={textAreaStyles}
                                            maxRows={40}
                                            name='group_description'
                                            // maxLength={40}
                                            value={values.group_description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Type your Group Description"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Add Drag and Drop area */}
                            <Grid item xs={12}>
                                <MDButton
                                    type="submit"
                                    style={submitButtonStyle}
                                    disabled={loading}
                                    endIcon={<MoonLoader loading={loading} size={18} color='#fff' />}
                                >
                                    Update
                                </MDButton>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>) :
                (
                    <GroupDetails data={data} />
                )
            }
        </GroupForm>
    )
}

const Styles = {
    fontWeight: "bold",
    fontSize: "15px",
    marginLeft: 4,
    verticalAlign: "middle",
};

const buttonStyles = {
    width: "244px",
    fontSize: "12px",
    height: "0px",
    color: "gray",
    minHeight: "25px",
};

const submitButton = {
    width: "150px",
    paddingBlock: "20px",
    borderRadius: "30px",
    fontSize: "16px",
    textTransform: "capitalize",
    boxShadow: "none !important",
    "&:hover": {
        boxShadow: "3px 4px 2px 10px #ccc",
    },
};

export default EditGroupChat
