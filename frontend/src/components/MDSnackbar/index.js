import PropTypes from "prop-types";

import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Custom styles for the MDSnackbar
import MDSnackbarIconRoot from "components/MDSnackbar/MDSnackbarIconRoot";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";
import { fontsFamily } from "assets/font-family";

function MDSnackbar({ delay = 5000, color, icon, title, dateTime, content, close, bgWhite, ...rest }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  let titleColor;
  let dateTimeColor;
  let dividerColor;

  if (bgWhite) {
    titleColor = color;
    dateTimeColor = "dark";
    dividerColor = false;
  } else if (color === "light") {
    titleColor = darkMode ? "inherit" : "dark";
    dateTimeColor = darkMode ? "inherit" : "text";
    dividerColor = false;
  } else {
    titleColor = "white";
    dateTimeColor = "white";
    dividerColor = true;
  }

  return (
    <Snackbar
      TransitionComponent={Fade}
      autoHideDuration={delay}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      {...rest}
      action={
        <IconButton size="small" aria-label="close" color="inherit" onClick={close}>
          <Icon fontSize="small">close</Icon>
        </IconButton>
      }
    >
      <MDBox
        variant={bgWhite ? "contained" : "gradient"}
        bgColor={bgWhite ? "white" : color}
        minWidth="26.875rem"
        maxWidth="100%"
        height="140px"
        shadow="md"
        // borderRadius="md"
        p={1}
        sx={{
          backgroundColor : '#F6F6E8',
          // backgroundColor: ({ palette }) =>
          //   darkMode ? palette.background.card : palette[color] || palette.white.main,
        }}
      >
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          color="dark"
          p={1.5}
        >
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <MDSnackbarIconRoot fontSize="small" ownerState={{ color, bgWhite }}>
              {icon}
            </MDSnackbarIconRoot>
            <MDTypography
              variant="button"
              fontWeight="medium"
              color={titleColor}
              fontSize=".975rem"
              textGradient={bgWhite}
              fontFamily={fontsFamily.poppins}
              // sx={{fontFamily:fontsFamily.poppins}}
            >
              {title}
            </MDTypography>
          </MDBox>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <MDTypography variant="caption" sx={{fontFamily:fontsFamily.poppins,fontSize:'.80rem'}} color={dateTimeColor}>
              {dateTime}
            </MDTypography>
            <Icon
              sx={{
                color: ({ palette: { dark, white } }) =>
                  (bgWhite && !darkMode) || color === "light" ? dark.main : white.main,
                fontWeight: ({ typography: { fontWeightBold } }) => fontWeightBold,
                cursor: "pointer",
                marginLeft: 2,
                transform: "translateY(-1px)",
                scale : 1.1,
              }}
              onClick={close}
            >
              close
            </Icon>
          </MDBox>
        </MDBox>
        <Divider sx={{ margin: 0 }} light={dividerColor} />
        <MDBox
          p={1.5}
          sx={{
            fontFamily: fontsFamily.poppins,
            fontSize: ({ typography: { size } }) => size.sm,
            color : '#333 !important',
            // fontSize: ({ typography: { size } }) => size.sm,
            // color: ({ palette: { white, text } }) => {
            //   let colorValue = bgWhite || color === "light" ? text.main : white.main;

            //   if (darkMode) {
            //     colorValue = color === "light" ? "inherit" : white.main;
            //   }

            //   return colorValue;
            // },
          }}
        >
          {content}
        </MDBox>
      </MDBox>
    </Snackbar>
  );
}

// Setting default values for the props of MDSnackbar
MDSnackbar.defaultProps = {
  bgWhite: false,
  color: "info",
};

// Typechecking props for MDSnackbar
MDSnackbar.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  dateTime: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  close: PropTypes.func.isRequired,
  bgWhite: PropTypes.bool,
};

export default MDSnackbar;
