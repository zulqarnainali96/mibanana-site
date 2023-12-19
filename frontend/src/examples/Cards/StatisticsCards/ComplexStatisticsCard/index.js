/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import { Button } from "@mui/material";
import BoxIcon from "assets/mi-banana-icons/phosphor.svg"

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function ComplexStatisticsCard({ color, title, message, count, percentage, icon, children, height = "185px" }) {
  return (
    <Card sx={{ height: height, display: "flex", justifyContent: "center", alignItems: "center", boxShadow: '2px 2px 16px -9px #000000 !important' }} >
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={1} px={2} elevation={10}>
        <MDBox textAlign="right" lineHeight={1.25} sx={{ display: "flex", gap: ".8rem", flexDirection: "column", alignItems: "center" }}>

          {message ?
            <Icon sx={{ height: 65, width: 65, backgroundColor: '#FFE135', borderRadius: 30, }}>
              <svg style={{ marginTop: 5 }} width="60" height="52" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.2" d="M4.13927 9.32715C4.04858 9.48098 4.00076 9.6563 4.00079 9.83487V22.1652C4.00079 22.3426 4.04801 22.5169 4.13758 22.67C4.22716 22.8232 4.35588 22.9498 4.51053 23.0368L15.5105 29.2243C15.6602 29.3085 15.8291 29.3527 16.0008 29.3527L16.0021 29.3527L16.1194 16L4.13929 9.32717L4.13927 9.32715Z" />
                <path d="M28.0008 22.165V9.83472C28.0008 9.65728 27.9536 9.48304 27.864 9.32987C27.7744 9.1767 27.6457 9.05013 27.4911 8.96314L16.4911 2.77564C16.3414 2.69145 16.1725 2.64722 16.0008 2.64722C15.8291 2.64722 15.6602 2.69145 15.5105 2.77564L4.51053 8.96314C4.35588 9.05013 4.22716 9.1767 4.13758 9.32987C4.04801 9.48304 4.00079 9.65728 4.00079 9.83472V22.165C4.00079 22.3425 4.04801 22.5167 4.13758 22.6699C4.22716 22.823 4.35588 22.9496 4.51053 23.0366L15.5105 29.2241C15.6602 29.3083 15.8291 29.3525 16.0008 29.3525C16.1725 29.3525 16.3414 29.3083 16.4911 29.2241L27.4911 23.0366C27.6457 22.9496 27.7744 22.823 27.864 22.6699C27.9536 22.5167 28.0008 22.3425 28.0008 22.165Z" stroke="#191B1C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22.1262 19.0639V12.5639L9.99841 5.875" stroke="#191B1C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M27.8615 9.3284L16.118 16L4.13788 9.32715" stroke="#191B1C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16.117 16L15.9996 29.3527" stroke="#191B1C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg></Icon> : null}
          <MDTypography variant="h6" fontSize="medium" textAlign="center" >{message ? message : count}</MDTypography>
        </MDBox>
      </MDBox>
      <Divider />
      {children ?
        (<MDBox pb={4} px={2} width="100%">
          {children}
          {/* <MDTypography variant="button" color="text" display="flex">
          <MDTypography
            component="span"
            variant="button"
            fontWeight="bold"
            color={percentage.color}
          >
            {percentage.amount}
          </MDTypography>
          &nbsp;{percentage.label}
        </MDTypography> */}
        </MDBox>) : null}
    </Card>
  );
}

// Setting default values for the props of ComplexStatisticsCard
ComplexStatisticsCard.defaultProps = {
  color: "info",
  percentage: {
    color: "success",
    text: "",
    label: "",
  },
};

// Typechecking props for the ComplexStatisticsCard
ComplexStatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  title: PropTypes.string.isRequired,
  height: PropTypes.string,
  message: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "white",
    ]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
  }),
  children: PropTypes.node,
  icon: PropTypes.node.isRequired,
};

export default ComplexStatisticsCard;
