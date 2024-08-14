import Card from '@mui/material/Card'
import MDBox from 'components/MDBox'
import React from 'react'
import "./brand-table.css"
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import Grid from '@mui/material/Grid'
import Add from '@mui/icons-material/Add'
import BrandForm from './Add-brand-form'
import brandData from './brandData'
import MDTypography from 'components/MDTypography'
import reduxContainer from 'redux/containers/containers'
import EditBrand from './Edit-Brand/EditBrand'
import SuccessModal from 'components/SuccessBox/SuccessModal'
import NewProjectsTable from 'examples/new-table'
import { mibananaColor } from 'assets/new-images/colors'
import { fontsFamily } from 'assets/font-family'
import { useMediaQuery } from '@mui/material'
import useBrandData from './useBrandData'
import closeIcon from 'assets/images/close.webp'
import check from 'assets/images/check.png'
import TransitionsModal from 'components/Modal/Modal'
import TransitionsErrorModal from 'components/Modal/ErrorModal'
import { handleRole } from 'redux/global/global-functions'
import { currentUserRole } from 'redux/global/global-functions'


const MIBrandTable = (props) => {
    const {
        role,
        renderSuccessSB,
        renderErrorSB,
        BrandButton,
        showSuccessModal,
        openEditModal,
        formValue,
        respMessage,
        closeSuccessModal,
        openAddBrandModal,
        setFormValue,
        openAddModal,
        image,
        addMoreField,
        editMoreImage,
        fileRef,
        onChangeText,
        closeAddBrandModal,
        closeEditBrandModal,
        handleFileUpload,
        setRespMessage,
        setEditMoreImages,
        handleFileUploadEdit,
        removeEditFiles,
        openSuccessSB,
        editAddMoreImages,
        openErrorSB,
        setAddMore,
        addMore,
        loading,
        onSubmit,
        setImage,
        setFilesArray,
        filesArray,
        checkState,
        setCheckState,
        getDescriptionText,
        openEditBrandModal,
        openModal,
        setOpenModal,
        successSB,
        setSuccessSB,
        errorSB,
        setErrorSB,
        quillRef,
        editQuillRef,
        isContentEmpty,
        setIsContentEmpty,
    } = useBrandData(props)

    const { reduxState, reduxActions } = props
    // const currentRole = (role?.admin || role?.projectManager || role?.designer) ? true : false
    const is768 = useMediaQuery("(max-width:768px)")
    const is500 = useMediaQuery("(max-width:500px)")
    const { rows, small_rows, columns, small_columns } = brandData(setFormValue, openEditBrandModal, openSuccessSB, openErrorSB, setRespMessage, reduxState, reduxActions)

    return (
        <DashboardLayout>
            <TransitionsModal
                message={respMessage}
                openModal={successSB}
                setOpenModal={setSuccessSB}
                check={check}
            />
            <TransitionsErrorModal
                message={respMessage}
                openModal={errorSB}
                setOpenModal={setErrorSB}
                closeIcon={closeIcon}
            />
            <BrandForm
                openAddModal={openAddModal}
                onChangeText={onChangeText}
                closeAddBrandModal={closeAddBrandModal}
                handleFileUpload={handleFileUpload}
                image={image}
                addMoreField={addMoreField}
                setAddMore={setAddMore}
                addMore={addMore}
                loading={loading}
                onSubmit={onSubmit}
                setImage={setImage}
                setFilesArray={setFilesArray}
                filesArray={filesArray}
                checkState={checkState}
                setCheckState={setCheckState}
                getDescriptionText={getDescriptionText}
                openModal={openModal}
                setOpenModal={setOpenModal}
                quillRef={quillRef}
                isContentEmpty={isContentEmpty}
            />
            <EditBrand
                onChange={onChangeText}
                onClose={closeEditBrandModal}
                open={openEditModal}
                setFormValue={setFormValue}
                formValue={formValue}
                openErrorSB={openErrorSB}
                openSuccessSB={openSuccessSB}
                setRespMessage={setRespMessage}
                editAddMoreImages={editAddMoreImages}
                editMoreImage={editMoreImage}
                handleFileUploadEdit={handleFileUploadEdit}
                fileRef={fileRef}
                removeEditFiles={removeEditFiles}
                setEditMoreImages={setEditMoreImages}
                getDescriptionText={getDescriptionText}
                editQuillRef={editQuillRef}
                isContentEmpty={isContentEmpty}
                setIsContentEmpty={setIsContentEmpty}

            />
            <SuccessModal
                msg={respMessage}
                open={showSuccessModal}
                onClose={closeSuccessModal}
                width="35%"
                color="#333"
                sideRadius={false}
            />

            <MDBox ml={4} pt={2} pb={3}>
                <Grid container justifyContent={"flex-end"} alignItems={"center"} spacing={2}>
                    <Grid item xxl={12} xl={12} md={12} xs={12}>
                        <Grid container alignItems={"center"} justifyContent={"space-around"}>
                            <Grid item xxl={12} xl={6}>
                                <MDTypography sx={{ ...titleStyles, fontSize: is500 ? '2rem' : '3rem', }}>miBrands</MDTypography>
                            </Grid>
                                <Grid item xxl={12} xl={12} lg={6} md={6} sm={6} xs={6}>
                                    <MDBox width={"100%"} sx={{ textAlign: "right", paddingInline: '32px' }}>
                                        <BrandButton
                                            variant="contained"
                                            size='medium'
                                            disableFocusRipple
                                            type="button"
                                            startIcon={<Add cursor={"pointer"} fontSize='large'
                                                sx={{
                                                    fontSize: '1.3rem !important',
                                                    display: 'inline-flex'
                                                }} />}
                                            onClick={openAddBrandModal}
                                        >
                                            ADD Brand
                                        </BrandButton>
                                    </MDBox>
                                </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xxl={12} xl={12} lg={12} md={12} xs={12}>
                        <Card sx={{ width: "98%", mt: '20px' }}>
                            <NewProjectsTable
                                table={{ columns: is768 ? small_columns : columns, rows: is768 ? small_rows : rows }}
                                entriesPerPage={{ defaultValue: 15 }}
                                showTotalEntries={true}
                                pagination={{ variant: 'contained', color: "warning" }}
                                noEndBorder={false}
                                canSearch={false}
                                isSorted={false}
                            />
                            {!rows?.length ? <MDTypography textAlign="center" p={1} component="h4">No Brands Found</MDTypography> : null}
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>


    )
}

export default reduxContainer(MIBrandTable)

const titleStyles = {
    width: '100%',
    color: mibananaColor.yellowColor,
    fontFamily: fontsFamily.poppins,
    fontWeight: 'bold !important',
    userSelect: 'none'
}