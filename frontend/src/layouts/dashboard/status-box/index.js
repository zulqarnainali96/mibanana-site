import React from 'react'
import { Grid } from '@mui/material'
import MDBox from 'components/MDBox'
import "./status-style.css"

const StatusBox = ({ children }) => {
    return (
        <Grid item className="status-box box-container" xs={12} xxl={3.6} xl={3.6} md={5.6} lg={3.6} pl={0} pt={0}>
            <MDBox className={`itemStyles status-box`} >
                {children}
            </MDBox>
        </Grid>
    )
}

export default StatusBox

{/* <Grid item className={styleSetup1 ? styles.selectedStyle : styles.hoverShadow} onClick={selectBox} xs={12} xxl={3.6} xl={3.6} md={4} lg={3} pl={0} pt={0}>
<MDBox className={styles.itemStyles} sx={{ height: is400 ? "175px" : "218px" }}>
    {children}
</MDBox>
</Grid> */}