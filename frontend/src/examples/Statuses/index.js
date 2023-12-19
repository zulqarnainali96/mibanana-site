import React, { useEffect, useState } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MDBox from 'components/MDBox';
import { useTheme } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { CloseSharp } from '@mui/icons-material';
import reduxContainer from 'redux/containers/containers';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        },
    },
};
const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];
function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}
const ProjectStatus = ({ data, status, handleChange, personName, clearValue }) => {
    const theme = useTheme()
    return (
        <FormControl sx={{ m: 2, width: 200, background: 'white', marginBottom: 1.7 }}>
            <InputLabel id="demo-multiple-name-label" sx={{ lineHeight: '0.9 !important', color: '#ccc !important' }} disableAnimation={true} size="small" classes={`.Mui-focused`} >{status}</InputLabel>
            <Select
                // autoWidth
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={personName}
                onChange={handleChange}
                MenuProps={MenuProps}
                IconComponent={() => personName ? <CloseSharp fontSize='small' sx={{ marginRight: 1, cursor: "pointer" }} onClick={clearValue} /> : <KeyboardArrowDownIcon fontSize='medium' sx={{ marginRight: 1, cursor: "pointer" }} />}

                sx={{
                    paddingBlock: "5px",
                    border: "1px solid #0000000a",
                    "&:hover": {
                        borderColor: 'transparent',
                    },
                    "& fieldset": {
                        borderColor: '#000' + ' !important',
                        borderWidth: 0 + " !important",
                        "&:focus": {
                            borderWidth: 0,
                            borderColor: `transparent` + " !important",
                        }
                    },
                    "& .MuiMenu-paper": {
                        backgroundColor: "red !important",

                    },
                }}
            >
                {data?.map((name) => (
                    <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, personName, theme)}
                    >
                        {name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default ProjectStatus
