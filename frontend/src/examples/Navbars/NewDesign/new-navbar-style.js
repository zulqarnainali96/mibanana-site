import { makeStyles } from "@mui/styles";
import { fontsFamily } from "assets/font-family";
import { mibananaColor } from "assets/new-images/colors";

export const useStyles = makeStyles({
    gridContainer: {
        backgroundColor: mibananaColor.headerColor,
        paddingBlock: '20px',
        paddingInline: '5rem',
        justifyContent : 'space-between'
    },
    poppins: fontsFamily.poppins + " !important",
    insideText: {
        fontFamily: fontsFamily.poppins + " !important",
        fontWeight: '800',
        color: 'black !important'

    },
    userRole: {
        color: '#000 !important',
        fontWeight: '400 !important'
    },
    notificationPoint : {
        position: 'absolute', 
        padding: '6px',
        top:6,
        right:6, 
        borderRadius: '30px',
        backgroundColor:mibananaColor.yellowColor
    },
    btnContainer: {
        backgroundColor: mibananaColor.yellowTextColor,
        padding: '4px',
        width: '51px',
        height: '53px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position : 'relative'
    }
})