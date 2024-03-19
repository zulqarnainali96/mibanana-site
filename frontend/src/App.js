import { useState, useEffect, useMemo, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";
// import Configurator from "examples/Configurator";
import theme from "assets/theme";
// import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
// import themeDarkRTL from "assets/theme-dark/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
// import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import routes from "routes";
import authRoutes from "authRoutes";
import AdminRoutes from "adminRoutes";
import projectManager from "manRoutes";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import MibananLogo from "assets/mi-banana-icons/mibanana-logo-1-color 1.png";
import NewNavbar from "examples/Navbars/NewDesign/NewNavbar";
import { currentUserRole } from "redux/global/global-functions";
import { useSelector } from "react-redux";
import ViewBrand from "examples/brand-table/view-brand/view-brand";
import "react-quill/dist/quill.snow.css";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useMediaQuery } from "@mui/material";
import MainComponent from "main-comp";
import { SocketContext } from "sockets";
import { io } from 'socket.io-client';


export default function App() {
  // process.env.REACT_APP_SOCKET_URL
  // 'http://localhost:4000'
  const socket = useMemo(() => {
    const socketO = io("http://localhost:4000", {
      withCredentials: true
    });
    return socketO
  }, [])

  const [controller, dispatch] = useMaterialUIController();
  const is1200 = useMediaQuery("(max-width:1199px)")
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const state = useSelector((state) => state);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Checking User Auth State

  // const user = useSelector(state => state.userDetails)
  const user = JSON.parse(localStorage.getItem("user_details"));
  const role = currentUserRole(state);
  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };
  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const currentPath = pathname.slice(1, pathname.length - 1);
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      return null;
    });

  function getallRoutes() {
    let route;
    if (user !== null) {
      if (role?.admin) {
        route = AdminRoutes
      }
      else if (role?.projectManager || role?.designer) {
        route = [...routes, projectManager]
      }
      else {
        route = routes
      }

    }
    return route
  }

  const manager_router = {
    key: "current-brand",
    route: "/brand/:id",
    component: <ViewBrand />,
  };
  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return (
    <SocketContext.Provider value={socket}>
      <MainComponent >
        <ThemeProvider theme={darkMode ? themeDark : theme}>
          <CssBaseline />
          {layout === "dashboard" && (
            <>
              {user !== null ? (
                <>
                  {is1200 ? null : <Sidenav
                    color={sidenavColor}
                    brand={
                      (transparentSidenav && !darkMode) || whiteSidenav ? MibananLogo : MibananLogo
                    }
                    brandName="MiBanana"
                    routes={
                      role?.admin
                        ? AdminRoutes
                        : [...routes, role?.projectManager || (role?.designer && manager_router)]
                    }
                    onMouseEnter={handleOnMouseEnter}
                    onMouseLeave={handleOnMouseLeave}
                  />}
                </>
              ) : null}
            </>
          )}
          <MDBox>
            {pathname === '/authentication/mi-sign-in' ? null : <NewNavbar routes={getallRoutes()} />}
            <Routes>
              {user !== null ? (
                role?.admin ? getRoutes(AdminRoutes) :
                  role?.projectManager || role?.designer ? getRoutes(projectManager) :
                    getRoutes(routes)) :
                getRoutes(authRoutes)
              }
              <Route
                path="*"
                element={
                  user !== null && user?.verified ? (
                    <Navigate to="/board" />
                  ) : (
                    <Navigate to="authentication/mi-sign-in" />
                  )
                }
              />
            </Routes>
          </MDBox>
        </ThemeProvider>
      </MainComponent>
    </SocketContext.Provider>
  );
}
