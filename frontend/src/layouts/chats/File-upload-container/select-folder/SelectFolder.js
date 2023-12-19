import { Autocomplete } from '@mui/material'
import TextField from '@mui/material/TextField'
import React from 'react'

const folderName = ['Customer Uploads', 'Designer Uploads']

const SelectFolder = ({ name, handleChange }) => {
    return (
        <React.Fragment>
            <Autocomplete
                value={name}
                onChange={(event, newValue) => handleChange(newValue)}
                id="select-upload-files"
                options={folderName}
                sx={sxStyles}
                renderInput={(params) => <TextField required {...params} placeholder="Select Files Folder" />}

            />
        </React.Fragment>
    )
}

export default SelectFolder

const sxStyles = {
    width: '100%',
    backgroundColor : 'white',
    "& .MuiInputBase-root" : {
        backgroundColor : 'white !important'
    }
}