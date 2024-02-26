import React from 'react'
import { Autocomplete, TextField, useMediaQuery, useTheme } from '@mui/material';
import { mibananaColor } from 'assets/new-images/colors';

const ProjectStatus = ({ data, status, handleChange, value, }) => {
    const isLg = useMediaQuery("(max-width:768px)")
    // const theme = useTheme()
    return (
        <Autocomplete
            sx={filterStyle}
            size={isLg ? 'small' : 'large'}
            options={data}
            onChange={(event,newValue) => {
                handleChange(newValue)
            }}
            
            value={value}
            renderInput={(params) => <TextField {...params} label={status} />}

        />
    )
}


const filterStyle = {
    "&.MuiFormControl-root" : {
        border: `1px solid ${mibananaColor.borderColor}`,
    },
    "&:hover": {
        borderColor: 'transparent',
    },
}

export default ProjectStatus
