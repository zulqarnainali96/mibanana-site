import Dashboard from "layouts/dashboard";
import Icon from "@mui/material/Icon";
import MIBrandTable from "examples/brand-table";
import ProjectTable from "layouts/ProjectsTable";
import EditProfile from "layouts/settings/edit-profile";
import ChangePassword from "layouts/settings/change-password";
import Chating from "layouts/chats";
import CreateAccounts from "layouts/settings/create-accounts";
import CreateCustomer from "layouts/settings/customer/customer";
import CurrentCustomerDetails from "layouts/settings/customer/current-customer/current-customer";
import SignUp from "layouts/settings/sign-up/sign-up";
import MibananaTeam from "layouts/mibanana-team";
import MobileAppDevelopment from "layouts/Projects/mobile-app-development/mobile-app-development";
import WebApp from "layouts/Projects/web-app/web-app";
import CopyWriting from "layouts/Projects/copy-writing/copy-writing";
import SocialMediaManager from "layouts/Projects/social-media-manager/social-media-manager";
import WebsiteDevelopment from "layouts/Projects/website-development/website-development";
import ResetPassword from "layouts/settings/reset-password/reset-password";

const AdminRoutes = [
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
        component: <Chating />
    },
    {
        type: "collapse",
        name: "MiBanana Team",
        key: "mibanana-team",
        icon: <Icon fontSize="small">handshake_outlined</Icon>,
        route: "/mibanana-team",
        component: <MibananaTeam />
    },
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
                name: "Change Password",
                key: "change-password",
                route: "/settings/change-password",
                component: <ChangePassword />, // Replace with your actual component for Profile settings
            },
            {
                name: "Create Accounts",
                key: "create-accounts",
                route: "/settings/create-accounts",
                component: <CreateAccounts />, // Replace with your actual component for Profile settings
            },
            {
                name: "Customer",
                key: "create-customer",
                route: "/settings/customers",
                component: <CreateCustomer />, // Replace with your actual component for Profile settings
            },
            {
                name: "Sign-up Customer",
                key: "sign-up-customer",
                route: "/settings/sign-up-customer",
                component: <SignUp />, // Replace with your actual component for Profile settings
            },
            {
                key: "create-customer",
                route: "/settings/customers/:id",
                component: <CurrentCustomerDetails />, // Replace with your actual component for Profile settings
            },
        ],
    },
];
export default AdminRoutes;
