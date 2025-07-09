import React from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { useTheme } from '../../../../src/context/ThemeContext';

const products = [
  {
    id: "1",
    name: "Sunil Joshi",
    post: "Web Designer",
    pname: "Elite Admin",
    priority: "Low",
    pbg: "primary.main",
    budget: "3.9",
  },
  {
    id: "2",
    name: "Andrew McDownland",
    post: "Project Manager",
    pname: "Real Homes WP Theme",
    priority: "Medium",
    pbg: "secondary.main",
    budget: "24.5",
  },
  {
    id: "3",
    name: "Christopher Jamil",
    post: "Project Manager",
    pname: "MedicalPro WP Theme",
    priority: "High",
    pbg: "error.main",
    budget: "12.8",
  },
  {
    id: "4",
    name: "Nirav Joshi",
    post: "Frontend Engineer",
    pname: "Hosting Press HTML",
    priority: "Critical",
    pbg: "success.main",
    budget: "2.4",
  },
];

const ExTable = () => {
  const { isDarkMode } = useTheme();

  return (
    <Table
      aria-label="simple table"
      sx={{
        mt: 3,
        whiteSpace: "nowrap",
        '& .MuiTableCell-root': {
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(224, 224, 224, 1)',
        },
      }}
    >
      <TableHead>
        <TableRow>
          <TableCell>
            <Typography 
              variant="h6"
              sx={{
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
              }}
            >
              Id
            </Typography>
          </TableCell>
          <TableCell>
            <Typography 
              variant="h6"
              sx={{
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
              }}
            >
              Assigned
            </Typography>
          </TableCell>
          <TableCell>
            <Typography 
              variant="h6"
              sx={{
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
              }}
            >
              Name
            </Typography>
          </TableCell>
          <TableCell>
            <Typography 
              variant="h6"
              sx={{
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
              }}
            >
              Priority
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Typography 
              variant="h6"
              sx={{
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
              }}
            >
              Budget
            </Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.name}>
            <TableCell>
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: "500",
                  color: isDarkMode ? '#ffffff' : 'inherit',
                }}
              >
                {product.id}
              </Typography>
            </TableCell>
            <TableCell>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "600",
                      color: isDarkMode ? '#ffffff' : 'inherit',
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                    }}
                  >
                    {product.post}
                  </Typography>
                </Box>
              </Box>
            </TableCell>
            <TableCell>
              <Typography 
                variant="h6"
                sx={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                }}
              >
                {product.pname}
              </Typography>
            </TableCell>
            <TableCell>
              <Chip
                sx={{
                  pl: "4px",
                  pr: "4px",
                  backgroundColor: product.pbg,
                  color: "#fff",
                }}
                size="small"
                label={product.priority}
              ></Chip>
            </TableCell>
            <TableCell align="right">
              <Typography 
                variant="h6"
                sx={{
                  color: isDarkMode ? '#ffffff' : 'inherit',
                }}
              >
                ${product.budget}k
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ExTable;
