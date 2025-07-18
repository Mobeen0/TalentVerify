import React, { useState } from "react";
import {
  experimentalStyled,
  useMediaQuery,
  Container,
  Box,
} from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header/Header";
import LandingHeader from './Header/LandingHeader'
import Sidebar from "./Sidebar/Sidebar";
import SidebarEmployer from './Sidebar/SidebarEmployer'
import SidebarInterviewee from './Sidebar/SidebarInterviewee'
import Footer from "./Footer/Footer";
import { TopbarHeight } from "../../assets/global/Theme-variable";
import { useTheme } from '../../context/ThemeContext';

import SignUp from '../../components/SignUp'

const MainWrapper = experimentalStyled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  overflow: "hidden",
  width: "100%",
}));

const PageWrapper = experimentalStyled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up("lg")]: {
    paddingTop: TopbarHeight,
  },
  [theme.breakpoints.down("lg")]: {
    paddingTop: "64px",
  },
}));

const FullLayout = (props) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const location = useLocation();
  const [userType,setUserType] = useState("")
  const [userJson,setUserJson] = useState({})
  const { isDarkMode } = useTheme();

  const isHomePage = location.pathname === '/';

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <MainWrapper>
      {isHomePage ? (
        <>
          <LandingHeader />    
            <SignUp setuserFunc = {setUserType} setUserName = {props.setUserName}/>
          <Footer isSidebarOpen = {false} />
        </>
      ) : (
        <>
          <Header
            sx={{
              paddingLeft: isSidebarOpen && lgUp ? "265px" : "",
              backgroundColor: "#ffffff",
              transition: "padding-left 0.3s ease",
            }}
            toggleSidebar={toggleSidebar}
            toggleMobileSidebar={toggleMobileSidebar}
          />
          {userType === "Employer" && <SidebarEmployer
            isSidebarOpen={isSidebarOpen}
            isMobileSidebarOpen={isMobileSidebarOpen}
            onSidebarClose={() => setMobileSidebarOpen(false)} />}

            {userType === "Interviewee" && <SidebarInterviewee
            isSidebarOpen={isSidebarOpen}
            isMobileSidebarOpen={isMobileSidebarOpen}
            onSidebarClose={() => setMobileSidebarOpen(false)} />}
            
            {(userType !== "Employer" && userType !== "Interviewee") && <Sidebar
            isSidebarOpen={isSidebarOpen}
            isMobileSidebarOpen={isMobileSidebarOpen}
            onSidebarClose={() => setMobileSidebarOpen(false)} />}
          <PageWrapper>
            <Container
              maxWidth={false}
              sx={{
                paddingTop: "20px",
                paddingLeft: isSidebarOpen && lgUp ? "280px!important" : "24px!important",
                paddingRight: "24px!important",
                width: "100%",
                maxWidth: "100% !important",
                transition: "all 0.3s ease",
                flex: 1,
                marginLeft: 0,
                marginRight: 0,
              }}
            >
              <Box sx={{ minHeight: "calc(100vh - 170px)" }}>
                <Outlet />
              </Box>
            </Container>
          </PageWrapper>
          <Footer isSidebarOpen={isSidebarOpen} />
        </>
      )}
    </MainWrapper>
  );
};

export default FullLayout;