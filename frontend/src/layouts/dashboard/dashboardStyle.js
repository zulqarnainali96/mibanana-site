const { makeStyles } = require("@mui/styles");

export const useStyles = makeStyles({
    itemStyles: {
        border: '2px solid #C6C3B6',
        width: '100%',
        padding: '45px',
        paddingInline: '4rem',
        cursor: 'pointer',
        "&:hover, * > :hover": {
            backgroundColor: '#FDD700 !important',
            color: "#000 !important"
        }
    },
    selectedStyle: {
        backgroundColor: '#FDD700 !important',
        boxShadow: '-4px 16px 29px -8px #44444461',
    },

    hoverShadow: {
        "&:hover": {
            boxShadow: '-4px 16px 29px -8px #44444461'
        }
    },
    headingStyle: {
        fontSize: '8rem !important',
        fontWeight: '800 !important',
        color: '#C6C3B6 !important',
    },
    headingStyle2: {
        fontSize: '1.38rem !important'
    }
})