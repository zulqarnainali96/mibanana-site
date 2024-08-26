import Dashboard from "layouts/dashboard";
import Icon from "@mui/material/Icon";
import MIBrandTable from "examples/brand-table";
import ProjectTable from "layouts/ProjectsTable";
import Chating from "layouts/chats";
import MibananaTeam from "layouts/mibanana-team";
import ProjectsDetails from "layouts/project-details/project_details";
import MobileAppDevelopment from "layouts/Projects/mobile-app-development/mobile-app-development";
import WebApp from "layouts/Projects/web-app/web-app";
import CopyWriting from "layouts/Projects/copy-writing/copy-writing";
import SocialMediaManager from "layouts/Projects/social-media-manager/social-media-manager";
import WebsiteDevelopment from "layouts/Projects/website-development/website-development";
const routes = [
  {
    type: "collapse",
    name: "Boards",
    key: "board",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/board",
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
    component: <Chating />,
  },
  {
    key: 'project',
    route: `/:project/:id`,
    component: <ProjectsDetails />
  },
  {
    type: "collapse",
    name: "MiBanana Team",
    key: "mibanana-team",
    icon: <Icon fontSize="small">handshake_outlined</Icon>,
    route: "/mibanana-team",
    component: <MibananaTeam />,
  },
  // New Project form route
  {
    name: 'Mobile App Development',
    key: 'mobile-app-development',
    route: "/mobile-app-development/:id",
    component: <MobileAppDevelopment />,
  },
  {
    name: 'Web App',
    key: 'web-app',
    route: "/web-app/:id",
    component: <WebApp />,
  },
  {
    name: 'CopyWriting',
    key: 'copy-writing',
    route: "/copy-writing/:id",
    component: <CopyWriting />,
  },
  {
    name: 'Social Media Manager',
    key: 'social-media-manager',
    route: "/social-media-manager/:id",
    component: <SocialMediaManager />,
  },
  {
    name: 'Website Development',
    key: 'website-development',
    route: "/website-development/:id",
    component: <WebsiteDevelopment />,
  }
];
export default routes;
