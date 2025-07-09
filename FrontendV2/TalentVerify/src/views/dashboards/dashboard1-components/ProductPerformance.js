import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { useTheme } from '../../../../src/context/ThemeContext';
import ExTable from "./ExTable";

const ProductPerformance = () => {
  const { isDarkMode } = useTheme();
  const [age, setAge] = React.useState("10");

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <Card 
      variant="outlined"
      sx={{
        backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e0e0e0',
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: {
              sm: "flex",
              xs: "block",
            },
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                marginBottom: "0",
                color: isDarkMode ? '#ffffff' : '#2c3e50',
              }}
              gutterBottom
            >
              Product Performance
            </Typography>
          </Box>

          <Box
            sx={{
              marginLeft: "auto",
              mt: {
                lg: 0,
                xs: 2,
              },
            }}
          >
            <FormControl variant="standard" sx={{ minWidth: 120 }}>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={age}
                onChange={handleChange}
                label="Age"
                sx={{
                  color: isDarkMode ? '#ffffff' : 'inherit',
                  '& .MuiSelect-icon': {
                    color: isDarkMode ? '#ffffff' : 'inherit',
                  },
                  '&:before': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover:not(.Mui-disabled):before': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                  },
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>March 2021</MenuItem>
                <MenuItem value={20}>April 2021</MenuItem>
                <MenuItem value={30}>Jun 2021</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box
          sx={{
            overflow: "auto",
            mt: 3,
          }}
        >
          <ExTable />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductPerformance;
