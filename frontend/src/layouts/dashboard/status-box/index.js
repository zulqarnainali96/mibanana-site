import React from 'react'
import { useStyles } from '../dashboardStyle'
import { Grid } from '@mui/material'
import MDBox from 'components/MDBox'
import { useState } from 'react'


const StatusBox = ({ children, is400 }) => {
    const styles = useStyles()
    const [styleSetup1, setStyleSetup1] = useState(false)

    const selectBox = () => setStyleSetup1(prev => !prev)
    return (
        <Grid item className={styleSetup1 ? styles.selectedStyle : styles.hoverShadow} onClick={selectBox} xs={12} xxl={3.7} xl={3.7} md={4} lg={3} pl={0} pt={0}>
            <MDBox className={styles.itemStyles} sx={{ height: is400 ? "230px" : "270px" }}>
                {children}
            </MDBox>
            {/* <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Good Evening"
                message={reduxState.userDetails?.name ? `Hi, ${reduxState.userDetails?.name.toUpperCase()} ${getUserRole()}` : ""}
              // count={281}
              // percentage={{
              //   color: "success",
              //   amount: "+55%",
              //   label: "than lask week",
              // }}
              />
            </MDBox> */}
        </Grid>
    )
}

export default StatusBox
