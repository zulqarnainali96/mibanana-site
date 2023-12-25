import React from 'react'
import MDBox from 'components/MDBox'
import { Grid, useMediaQuery } from '@mui/material'
import MibananaIcon from 'assets/new-images/navbars/mibanana-logo.png'
import { useStyles } from './new-navbar-style'
import personImage from 'assets/new-images/navbars/Rectangle.png'
import MDTypography from 'components/MDTypography'
import { notificationsIcon } from 'assets/new-images/navbars/notificationIcon'
import { infoCircle } from 'assets/new-images/navbars/info-circle'

const NewNavbar = () => {
  const navbarStyles = useStyles()
  const isLarge = useMediaQuery("(max-width:600px)")

  return (
    <Grid container className={navbarStyles.gridContainer}>
      <Grid item xxl={8} xl={8} lg={8} md={12} xs={12} textAlign={isLarge && "center"}>
        <img src={MibananaIcon} loading='lazy' width={isLarge ? "60%" : "26%"} />
      </Grid >
      <Grid item xxl={4} xl={4} lg={4} md={12} xs={12}>
        <Grid container alignItems="center">
          <Grid item xxl={2} xl={2} lg={2} pl={"20px"} md={2} xs={2} alignSelf={"flex-end"}>
            <img src={personImage} style={{ display: "block" }} width={"61px"} height={"61px"} />
          </Grid>
          <Grid item xxl={4} xl={4} lg={4} md={12} xs={6}>
            <MDTypography className={navbarStyles.insideText}>Hello Designer!</MDTypography>
            <MDTypography fontSize="medium" className={`${navbarStyles.poppins} ${navbarStyles.userRole}`}>(Graphic Designer)</MDTypography>
          </Grid>
          <Grid item xxl={3} xl={3} xs={4}>
            <Grid container spacing={0}>
              <Grid item lg={6}>
                <div style={{ backgroundColor: '#333333', padding: '4px', width: '51px', cursor: 'pointer' }}>
                  {notificationsIcon}
                </div>
              </Grid>
              <Grid item lg={6}>
                <div style={{ backgroundColor: '#333333', padding: '4px', width: '51px', cursor: 'pointer' }}>
                  {infoCircle}
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid >
    </Grid>
  )
}

export default NewNavbar

