import { Fragment, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const AutoList = ({
    autoListOpen,
    setAutoListOpen,
    options,
    teamLoading,
    selectedOptions,
    setSelectedOptions
}) => {
    return (
        <Autocomplete
            multiple
            id="asynchronous-d"
            sx={{ width: '100%' }}
            open={autoListOpen}
            onOpen={() => {
                setAutoListOpen(true);
            }}
            onClose={() => {
                setAutoListOpen(false);
            }}
            
            disableCloseOnSelect
            isOptionEqualToValue={(option, value) => option._id === value._id}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={teamLoading}
            value={selectedOptions}
            onChange={(event, newValue) => {
                setSelectedOptions(newValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Add Members"
                    error={selectedOptions.length === 0}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <Fragment>
                                {teamLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </Fragment>
                        ),
                    }}
                />
            )}
            renderOption={(props, option, { selected }) => (
                <li {...props} key={option._id}>
                    <input
                        type="checkbox"
                        checked={selected}
                        style={{ marginRight: 8 }}
                    />
                    {option.name + (option.roles && option.roles.length > 0 ? " (" + option.roles[0] + ")" : "")}
                </li>
            )}
        />
    )
}

export default AutoList;
