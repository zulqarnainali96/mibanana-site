import { makeStyles } from "@mui/styles";
import { fontsFamily } from "assets/font-family";
import { mibananaColor } from "assets/new-images/colors";

export const useStyles = makeStyles({
    gridContainer: {
        backgroundColor: mibananaColor.headerColor,
        paddingBlock: '20px',
        paddingInline: '5rem',
    },
    poppins: fontsFamily.poppins + " !important",
    insideText: {
        fontFamily: fontsFamily.poppins + " !important",
        fontWeight: '800',
        color: 'black !important'

    },
    userRole: {
        color : '#000 !important',
        fontWeight : '400 !important'
    }
})