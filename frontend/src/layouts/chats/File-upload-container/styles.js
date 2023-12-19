import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles({
    Container: {
        position: 'relative',
        width: '100%',
        border: "3px solid #33333321",
        height: "87vh",
        borderRadius: "8px",
        position: "relative",
    },
    secondContainer: {
        padding: '12px 14px',
        width: '100%',
        display : 'flex',
        justifyContent : 'flex-start',
        alignItems : 'center',
        position: 'absolute',
        gap : '10px',
        backgroundColor: '#FFE135 !important',
        top: '0px',
        zIndex: 5
    },
    sideBarContainer: {
        position: "absolute",
        left: '0px',
        width: '230px',
        height: '100%',
        overflowY: 'auto',
        backgroundColor: '#ccc !important',
        padding: '14px',
        paddingTop: '4rem',
        paddingBottom: '5.4rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        zIndex: 3,
        scrollbarColor: '#444',
        '&::-webkit-scrollbar': {
            width: '11px',
        },
        '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            cursor: 'pointer'
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '8px',
            cursor: 'pointer'
        },
        '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
            cursor: 'pointer'
        },
    },
    mainImageContainer: {
        position: "absolute",
        right: '0px',
        width: '75%',
        height: '100%',
        overflowY: 'auto',
        backgroundColor: 'white !important',
        padding: '14px',
        paddingTop: '4rem',
        paddingBottom: '5.4rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        zIndex: 3,
        scrollbarColor: '#444',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '&::-webkit-scrollbar': {
            width: '11px',
        },
        '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            cursor: 'pointer'
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '8px',
            cursor: 'pointer'
        },
        '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
            cursor: 'pointer'
        },
    },
    uploadBox: {
        position: 'absolute',
        bottom: '0px',
        color: '',
        backgroundColor: '#FFE135 !important',
        padding: '10px 10px',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 0,
        zIndex: 5
    },
    fileNameContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white !important',
        paddingInlineStart: '8px !important',
        borderRadius: '8px !important'
    },
    fileNameInput: {
        width: '87%',
        background: 'white !important',
    },
    iconBtn: {
        backgroundColor: "#ccc !important",
        borderTopRightRadius: '5px !important',
        borderBottomRightRadius: '5px !important',
        borderTopLeftRadius: '0px !important',
        borderBottomLeftRadius: '0px !important',
        padding: '5px 7px',
    },
})