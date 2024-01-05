import MDBox from 'components/MDBox'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import React from 'react'
import noPageFound from 'assets/new-images/mibanana-team/no-page.png'
import { Grid, useMediaQuery } from '@mui/material'
import MDTypography from 'components/MDTypography'
import { fontsFamily } from 'assets/font-family'
import { mibananaColor } from 'assets/new-images/colors'


const MibananTeam = () => {
    const is768 = useMediaQuery("(min-width:768px)")
    return (
        <DashboardLayout>
            <Grid container spacing={2} py={5} px={2} mt={0} flexDirection={"column"} alignItems={"center"}>
                <Grid item xxl={4} xl={4} alignSelf={"flex-start"} lg={12}  md={12}>
                    <MDTypography sx={titleStyles}>mibanana Team</MDTypography>
                </Grid>
                <Grid item xxl={8} xl={8} textAlign={"center"}>
                    <img src={noPageFound} width={"60%"} alt="no-page-found" />
                </Grid>
            </Grid>
        </DashboardLayout>
    )
}

const titleStyles = {
    fontSize: '2.5rem',
    width: '100%',
    color: mibananaColor.yellowColor,
    fontFamily: fontsFamily.poppins,
    fontWeight: 'bold !important',
    userSelect: 'none'
}

export default MibananTeam
