import Dashboard from "layouts/dashboard";
import Icon from "@mui/material/Icon";
import ProjectTable from "layouts/ProjectsTable";
import EditProfile from "layouts/settings/edit-profile";
import CompanyProfile from "layouts/settings/company-profile/company-profile";
import ChangePassword from "layouts/settings/change-password";
import ViewBrand from "examples/brand-table/view-brand/view-brand";
import MibananTeam from "layouts/mibanana-team";
import MIBrandTable from "examples/brand-table";
import Chating from "layouts/chats";


// const Chating = lazy( () => import("layouts/chats"))
// const MIBrandTable = lazy( () => import("examples/brand-table"))


const routes = [
  {
    type: "collapse",
    name: "Boards",
    key: "board",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/board",
    // component: <div><h1>Hello</h1></div>,
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "MiProjects",
    key: "mi-projects",
    icon: <Icon fontSize="small">event_note</Icon>,
    route: "/mi-projects",
    // component: <div><h1>Hello</h1></div>,
    component: <ProjectTable />,
  },
  {
    type: "collapse",
    name: "MiBrands",
    key: "mi-brands",
    icon: <Icon fontSize="small">create_new_folder_rounded_icon</Icon>,
    route: "/mi-brands",
    // component: <div><h1>Hello</h1></div>,
    component: <MIBrandTable />,
    
  },
  {
    key: "chat",
    route: "/chat/:id",
    component: <Chating />
  },
  {
    key: "current-brand",
    route: "/brand/:id",
    component: <ViewBrand />
  },
  {
    type: "collapse",
    name: "MiBanana Team",
    key: "mibanana-team",
    icon: <Icon fontSize="small">handshake_outlined</Icon>,
    route: "/mibanana-team",
    component : <MibananTeam />
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
