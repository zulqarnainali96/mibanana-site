import React from 'react'
import Grid from '@mui/material/Grid'
import CircularProgress from "@mui/material/CircularProgress";

const CircularProgressLoader = () => {
    return (
        <Grid container sx={gridStyle}>
            <Grid item textAlign="center" {...uiSize}>
                <CircularProgress />
            </Grid>
        </Grid>
    )
}

const uiSize = { xxl: 12, xl: 12, md: 12, lg: 12, sm: 12, xs: 12 }

const gridStyle = {
    justifyContent: "center",
    height: "30vh",
    alignItems: "center"
}

export default CircularProgressLoader
