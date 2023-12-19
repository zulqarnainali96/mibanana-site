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

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Icon from "@mui/material/Icon";
import MIBrandTable from "examples/brand-table";
import ProjectTable from "layouts/ProjectsTable";
import EditProfile from "layouts/settings/edit-profile";
import CompanyProfile from "layouts/settings/company-profile/company-profile";
import ChangePassword from "layouts/settings/change-password";
import Chating from "layouts/chats";
import Navbar from "examples/Navbars/MyNavbar/Navbar";

const user = JSON.parse(localStorage.getItem('user_details'))
const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "MiProjects",
    key: "mi-projects",
    icon: <Icon fontSize="small">event_note</Icon>,
    route: "/mi-projects",
    component: <ProjectTable />,
  },
  {
    type: "collapse",
    name: "MiBrands",
    key: "mi-brands",
    icon: <Icon fontSize="small">create_new_folder_rounded_icon</Icon>,
    route: "/mi-brands",
    component: <MIBrandTable />,
  },
  {
    key: "chat",
    route: "/chat/:id",
    component: <Chating />
  },

  {
    type: "collapse",
    name: "MiBanana Team",
    key: "rtl",
    icon: <Icon fontSize="small">handshake_outlined</Icon>,
    route: "/rtl",
    component: <Navbar />
  },
  {
    type: "collapse-dropdown",
    name: "Settings",
    key: "settings",
    icon: <Icon fontSize="small">settings</Icon>,
    collapse: [
      {
        name: "Profile",
        key: "profile",
        route: "/settings/profile",
        component: <EditProfile />, // Replace with your actual component for Profile settings
      },
      {
        name: "Company Profile",
        key: "company-profile",
        route: "/settings/company-profile",
        component: <CompanyProfile />, // Replace with your actual component for General settings
      },
      {
        name: "Change Password",
        key: "change-password",
        route: "/settings/change-password",
        component: <ChangePassword />, // Replace with your actual component for Profile settings
      },
    ],
  },
];
export default routes;
