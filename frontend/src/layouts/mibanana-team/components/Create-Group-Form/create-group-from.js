import { ArrowForward, CloseOutlined } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, MenuItem, Select, TextField, useMediaQuery } from '@mui/material';
import { styled } from '@mui/styles';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import React from 'react'
import useCreateGroupForm from './use-create-group-form';
import { MoonLoader } from 'react-spinners';
// import MDBox from 'components/MDBox';
// import MDInput from 'components/MDInput';
import { submitButtonStyle } from 'examples/Navbars/mobile-app-dev-form/mobile-app-dev-form';
import Input from 'components/Input/Input';
import AutoList from './components/AutoList';
import reduxContainer from 'redux/containers/containers';


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



const CreateGroupForm = ({ reduxState, open, onClose, openSuccessSB, openErrorSB, setRespMessage, setReload }) => {
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
        textAreaStyles,
        touched,    
        selectedOptions,
        setSelectedOptions
     } = useCreateGroupForm(reduxState, onClose, openSuccessSB, openErrorSB, setRespMessage, setReload)

    return (
        <GroupForm open={open}>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <MDTypography>
                    Create Group
                </MDTypography>
                <MDButton onClick={onClose} sx={{ position: "absolute", right: 4 }}>
                    <CloseOutlined />
                </MDButton>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xxl={6} xl={6} lg={6} sm={12} xs={12}>
                            <MDTypography variant="h6" pb={1} className="copywriting-title">
                                Group Name
                            </MDTypography>
                            <Input
                                placeholder="Type your Group Name"
                                id="group_name"
                                name="group_name"
                                type="text"
                                value={values.group_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                touched={touched.group_name}
                                errors={errors.group_name}
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
                                        selectedOptions={selectedOptions}
                                        setSelectedOptions={setSelectedOptions}

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
                                        maxLength={40}
                                        value={values.group_description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        touched={touched.group_description}
                                        errors={errors.group_description}
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
                                Submit
                            </MDButton>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
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

export default reduxContainer(CreateGroupForm)
