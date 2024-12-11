import React from "react";
import {useState} from "react";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import {baseTheme} from './assets/global/Theme-variable'
import Themeroutes from "./routes/Router";
import './App.css'

const App = () => {
  const [userName,setUserName] = useState('')
  const routing = useRoutes(Themeroutes({userName,setUserName}));
  const theme = baseTheme;
  return (
    <ThemeProvider theme={theme}>
      {routing}
    </ThemeProvider>
  );
};

export default App;
