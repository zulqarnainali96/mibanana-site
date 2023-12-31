import PropTypes from "prop-types";
// @mui material components
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";
import { ArrowDropDownCircleOutlined } from "@mui/icons-material";



import MDBox from "components/MDBox";
// Custom styles for the SidenavCollapse
import {
  collapseItem,
  collapseIconBox,
  collapseIcon,
  collapseText,
} from "examples/Sidenav/styles/sidenavCollapse";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

function SidenavCollapse({ icon, name, active, ...rest }) {
  const [controller] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  let path = window.location.pathname
  return (
    <ListItem component="li">
      <MDBox
        style={{ margin: 0, borderRadius: 0, color: '#626C70', fontWeight: '500 !important' }}
        {...rest}
        sx={
          (theme) =>
            collapseItem(theme, {
              active,
              transparentSidenav,
              whiteSidenav,
              darkMode,
              sidenavColor,
            })
        }
      >
        <ListItemIcon
          sx={
            (theme) =>
              collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode, active })
          }
        >
          {typeof icon === "string" ? (
            <Icon sx={(theme) => collapseIcon(theme, { active })}>{icon}</Icon>
          ) : (
            icon
          )}
        </ListItemIcon>

        <ListItemText
          primary={name}
          sx={
            (theme) =>
              collapseText(theme, {
                miniSidenav,
                transparentSidenav,
                whiteSidenav,
                active,
              })
          }
        />
        {name === 'Settings' && <Icon fontSize="small"><ArrowDropDownCircleOutlined /></Icon>}
      </MDBox>
    </ListItem>
  );
}

// Setting default values for the props of SidenavCollapse
SidenavCollapse.defaultProps = {
  active: false,
};

// Typechecking props for the SidenavCollapse
SidenavCollapse.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

export default SidenavCollapse;
