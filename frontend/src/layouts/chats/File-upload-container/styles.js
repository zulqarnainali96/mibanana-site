import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  dropdown: {
    minWidth: "120px",
    backgroundColor: "white",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "8px 12px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f3f3f3",
    },
  },
  Container: {
    position: "relative",
    width: "100%",
    border: "3px solid #33333321",
    height: "87vh",
    borderRadius: "8px",
    position: "relative",
  },
  secondContainer: {
    padding: "12px 14px",
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "absolute",
    gap: "10px",
    // backgroundColor: '#FFE135 !important',
    top: "0px",
    zIndex: 5,
  },
  sideBarContainer: {
    position: "absolute",
    left: "0px",
    width: "230px",
    height: "100%",
    overflowY: "auto",
    backgroundColor: "#ccc !important",
    padding: "14px",
    paddingTop: "4rem",
    paddingBottom: "5.4rem",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    zIndex: 3,
    scrollbarColor: "#444",
    "&::-webkit-scrollbar": {
      width: "11px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
      cursor: "pointer",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888",
      borderRadius: "8px",
      cursor: "pointer",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#555",
      cursor: "pointer",
    },
  },
  mainImageContainer: {
    position: "absolute",
    right: "0px",
    width: "75%",
    height: "100%",
    overflowY: "auto",
    backgroundColor: "white !important",
    padding: "14px",
    paddingTop: "4rem",
    paddingBottom: "5.4rem",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    zIndex: 3,
    scrollbarColor: "#444",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&::-webkit-scrollbar": {
      width: "11px",
      borderRadius: 10,
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
      cursor: "pointer",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888",
      borderRadius: "8px",
      cursor: "pointer",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#555",
      cursor: "pointer",
    },
  },
  uploadBox: {
    position: "absolute",
    bottom: "0px",
    color: "",
    backgroundColor: "#FFE135 !important",
    padding: "10px 10px",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 0,
    zIndex: 5,
  },
  fileNameContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white !important",
    paddingInlineStart: "8px !important",
    borderRadius: "8px !important",
  },
  fileNameInput: {
    width: "87%",
    background: "white !important",
  },
  iconBtn: {
    backgroundColor: "#ccc !important",
    borderTopRightRadius: "5px !important",
    borderBottomRightRadius: "5px !important",
    borderTopLeftRadius: "0px !important",
    borderBottomLeftRadius: "0px !important",
    padding: "5px 7px",
  },
  uploadbtndiv: {
    display: "flex",
    overflowX : 'auto',
    gap : '7px',
    "& > select" : {
      cursor : 'pointer',
    },
    "&::-webkit-scrollbar" : {
      width : 0,
      height : 0 
    }
  },
  uploadbtn: {
    border: "1px solid gray",
    background: "transparent",
    color: "black",
    padding : '4px 12px',
    margin: "0px 5px",
    fontFamily: "Poppins",
    fontSize: "12px",
  },
  "uploadbtn:hover": {
    background: "#FDD700",
  },
  uploadfilebtn: {
    background: "black",
    color: "#FDD700",
    width: "95%",
    marginLeft: "12px",
  },
  "uploadfilebtn:hover": {
    background: "black",
  },
  dropfileDiv: {
    width: "97.5%",
    margin: "5px auto",
    padding: "10px",
    border: "1px solid gray",
    borderStyle: "dotted",
    textAlign: "center",
    color: "gray",
    background: "#C6C3B6",
  },
  uploadedfileMainDiv: {
    margin: "5px",
    // padding: "5px 10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position : 'relative',
  },
  UserDiv: {
    width: "100%",
    background: "#F6F6E8",
    display: "flex",
    alignItems: "center",
  },
  fileDiv2: {
    margin: "5px 10px",
  },
  fileDiv2p: {
    textAlign: "center",
    fontSize: "11px",
  },
  adminDiv1: {
    display: "flex",
    flexDirection: "column",
    margin: "5px",
    padding: "5px",
    width: "20%",
    fontFamily: "Poppins",

  },
  adminInsideDiv : {

  },
  adminDivGrid: {
    background: "#F6F6E8",
    justifyContent: "space-between",
  },
  catdiv1: {
    width: "25%",
  },
  descriptiondiv : {
    width: "100%",
    paddingInline : '10px',
    "& > p, ol, ul " : {
      paddingInline : '14px',
    }
  },
  adminDiv2h3: {
    fontSize: "13px",
  },
  adminDiv2p: {
    fontSize: "11px",
  },
  catdivmain: {
    display: "flex",
    margin: "0px",
    padding: "5px",
    background: "#F6F6E8",
    flexWrap: "wrap",
    fontFamily: "Poppins",
  },
  adminDiv1h2: {
    color: "#C6C3B6",
    fontSize: "13px",
  },
});
