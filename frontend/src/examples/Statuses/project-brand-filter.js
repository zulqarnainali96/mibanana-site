import React from 'react'
import { Autocomplete, TextField, useMediaQuery } from '@mui/material';
import { mibananaColor } from 'assets/new-images/colors';

const BrandFilter = ({ data, status, handleChange, personName, clearValue }) => {
    const isLg = useMediaQuery("(max-width:768px)")
    return (
        <Autocomplete
            sx={filterStyle}
            size={isLg ? 'small' : 'large'}
            options={data}
            onChange={(event, newValue) => {
                handleChange(newValue)
            }}
            value={personName}
            renderInput={(params) => <TextField {...params} label={status} />}

        />
    )
}

const filterStyle = {
    "&.MuiFormControl-root": {
        border: `1px solid ${mibananaColor.borderColor}`,
    },
    // "&:hover": {
    //     borderColor: 'transparent',
    // },
}

export default BrandFilter
