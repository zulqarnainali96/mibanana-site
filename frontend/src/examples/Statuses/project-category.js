import React from 'react';
import { Autocomplete, TextField, useMediaQuery } from '@mui/material';
import { mibananaColor } from 'assets/new-images/colors';

const CategoryFilter = ({ data, status, handleChange, personName }) => {
    const isLg = useMediaQuery("(max-width:768px)");

    const formattedData = data.map(item =>
        item
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    );

    const handleCategoryChange = (newValue) => {
        const originalValue = newValue
            ? newValue.split(" ").map(word => word.toLowerCase()).join("-")
            : null;

        handleChange(originalValue);
    };

    return (
        <Autocomplete
            sx={filterStyle}
            size={isLg ? 'small' : 'large'}
            options={formattedData}
            onChange={(event, newValue) => handleCategoryChange(newValue)}
            value={formattedData[data.indexOf(personName)] || ""}
            renderInput={(params) => <TextField {...params} label={status} />}
        />
    );
};

const filterStyle = {
    "&.MuiFormControl-root": {
        border: `1px solid ${mibananaColor.borderColor}`,
    },
    "&:hover": {
        borderColor: 'transparent',
    },
};

export default CategoryFilter;