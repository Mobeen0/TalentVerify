import React from "react";
import {useState} from "react";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import {baseTheme} from './assets/global/Theme-variable'
import Themeroutes from "./routes/Router";
import './App.css'
import { ThemeProvider as ContextThemeProvider } from './context/ThemeContext';

const App = () => {
  const [userName,setUserName] = useState('')
  const routing = useRoutes(Themeroutes({userName,setUserName}));
  const theme = baseTheme;
  return (
    <ThemeProvider theme={theme}>
      <ContextThemeProvider>
        {routing}
      </ContextThemeProvider>
    </ThemeProvider>
  );
};

export default App;
