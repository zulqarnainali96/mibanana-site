import { Button, useMediaQuery } from '@mui/material';
import { fontsFamily } from 'assets/font-family';
import { useEffect, useRef, useState } from 'react'
import { styled } from "@mui/material/styles";

const useProjectMenuPoper = (props) => {
    const { 
        handleCopyWriting, 
        handleClickOpen, 
        handleWebsite,
        handleSocialMedia,
        handleWebAppDev,
        handleMobileAppDev,
    } = props
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const is1040 = useMediaQuery("(max-width:1040px)")

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const ProjectButton2 = styled(Button)(({ theme: { palette } }) => {
        const { primary } = palette;
        return {
            backgroundColor: primary.main,
            fontFamily: fontsFamily.poppins,
            fontWeight: "400",
            paddingInline: is1040 ? '13px !important' : '12px !important',
            fontSize: is1040 ? '10px !important' : '13px !important',
            padding: is1040 ? '4px !important' : '12px',
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

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open);

    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const openGraphicDesign = () => {
        handleClickOpen()
    }
    const openCopyWriting = () => {
        handleCopyWriting()
    }
    const openSocialMedia = () => {
        handleSocialMedia()
    }
    const openWebsite = () => {
        handleWebsite()
    }
    const openWebApp = () => {
        handleWebAppDev()
    }
    const openMobileAppDev = () => {
        handleMobileAppDev()
    }

    return {
        open,
        is1040,
        anchorRef,
        openWebApp,
        handleClose,
        openWebsite,
        handleToggle,
        openCopyWriting,
        ProjectButton2,
        handleListKeyDown,
        openSocialMedia,
        openGraphicDesign,
        openMobileAppDev,

    }
}

export default useProjectMenuPoper
