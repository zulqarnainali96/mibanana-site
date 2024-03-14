import * as React from 'react';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import { styled } from "@mui/material/styles";
import { projectIcon } from "assets/new-images/navbars/create-project-icon";
import { fontsFamily } from 'assets/font-family';
// import { useMediaQuery } from '@mui/material';
import useProjectMenuPoper from './useProjectMenuPoper';

const ProjectButton = styled(Button)(({ theme: { palette } }) => {
    const { primary } = palette;
    return {
        backgroundColor: primary.main,
        fontFamily: fontsFamily.poppins,
        fontWeight: "400",
        paddingBlock: "0.9rem",
        borderRadius: 0,
        height: "100%",
        "&:hover": {
            backgroundColor: "#d9ba08",
        },
        "&:focus": {
            backgroundColor: "#d9ba08 !important",
        },
    };
});

export default function ProjectMenuOptions(props) {
    const { size } = props;
    const {
        open,
        is1040,
        anchorRef,
        ProjectButton2,
        handleClose,
        openWebApp,
        openWebsite,
        openMobileAppDev,
        openCopyWriting,
        openGraphicDesign,
        handleToggle,
        handleListKeyDown,
        openSocialMedia,
    } = useProjectMenuPoper(props);

    return (
        <Stack direction="row" spacing={2}>
            <div>
                <>
                    {is1040 ?
                        <ProjectButton2
                            variant="contained"
                            size={size}
                            className="create-project-btn"
                            startIcon={projectIcon}
                            ref={anchorRef}
                            id="composition-button"
                            aria-controls={open ? 'composition-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleToggle}
                        >
                            Create Project
                        </ProjectButton2>
                        :
                        <ProjectButton
                            variant="contained"
                            size={size}
                            className="create-project-btn"
                            startIcon={projectIcon}
                            ref={anchorRef}
                            id="composition-button"
                            aria-controls={open ? 'composition-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleToggle}
                        >
                            Create Project
                        </ProjectButton>
                    }
                </>
                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    placement="bottom-start"
                    sx={{ zIndex: 1 }}
                    transition
                    disablePortal
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin:
                                    placement === 'bottom-start' ? 'left top' : 'left bottom',
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList
                                        autoFocusItem={open}
                                        id="composition-menu"
                                        aria-labelledby="composition-button"
                                        onKeyDown={handleListKeyDown}
                                    >
                                        <MenuItem onClick={openGraphicDesign}>Graphic Desgin</MenuItem>
                                        <MenuItem onClick={openCopyWriting}>CopyWriting</MenuItem>
                                        <MenuItem onClick={openSocialMedia}>Social Media Manager</MenuItem>
                                        <MenuItem onClick={openWebsite}>Website Development</MenuItem>
                                        <MenuItem onClick={openWebApp}>Website App</MenuItem>
                                        <MenuItem onClick={openMobileAppDev}>Mobile App Development</MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        </Stack>
    );
}