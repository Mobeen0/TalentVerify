import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useTheme } from '../../../../src/context/ThemeContext';
import Chart from 'react-apexcharts';

const SalesOverview = () => {
  const { isDarkMode } = useTheme();

  const optionssalesoverview = {
    grid: {
      show: true,
      borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "transparent",
      strokeDashArray: 2,
      padding: {
        left: 0,
        right: 0,
        bottom: 0,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "42%",
        endingShape: "rounded",
        borderRadius: 5,
      },
    },
    colors: ["#1e4db7", "#a7e3f4"],
    fill: {
      type: "solid",
      opacity: 1,
    },
    chart: {
      offsetX: -15,
      toolbar: {
        show: false,
      },
      foreColor: isDarkMode ? "#ffffff" : "#adb0bb",
      fontFamily: "'DM Sans',sans-serif",
      sparkline: {
        enabled: false,
      },
      background: isDarkMode ? '#1a1a1a' : '#ffffff',
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    legend: {
      show: false,
    },
    xaxis: {
      type: "category",
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "July", "Aug", "Sept", "Oct", "Nov", "Dec",
      ],
      labels: {
        style: {
          colors: isDarkMode ? '#ffffff' : '#adb0bb',
        },
      },
      axisBorder: {
        show: true,
        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e0e0e0',
      },
      axisTicks: {
        show: true,
        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e0e0e0',
      },
    },
    yaxis: {
      show: true,
      min: 100,
      max: 400,
      tickAmount: 3,
      labels: {
        style: {
          colors: isDarkMode ? '#ffffff' : '#adb0bb',
        },
      },
      axisBorder: {
        show: true,
        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e0e0e0',
      },
    },
    stroke: {
      show: true,
      width: 5,
      lineCap: "butt",
      colors: ["transparent"],
    },
    tooltip: {
      theme: isDarkMode ? "dark" : "light",
    },
  };

  const seriessalesoverview = [
    {
      name: "Ample Admin",
      data: [355, 390, 300, 350, 390, 180, 355, 390, 300, 350, 390, 180],
    },
    {
      name: "Pixel Admin",
      data: [280, 250, 325, 215, 250, 310, 280, 250, 325, 215, 250, 310],
    },
  ];

  return (
    <Card
      variant="outlined"
      sx={{
        paddingBottom: "0",
        backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e0e0e0',
      }}
    >
      <CardContent
        sx={{
          paddingBottom: "16px !important",
        }}
      >
        <Box
          sx={{
            display: {
              sm: "flex",
              xs: "block",
            },
            alignItems: "center",
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
              Sales Overview
            </Typography>
          </Box>
          <Box
            sx={{
              marginLeft: "auto",
              display: "flex",
              mt: {
                lg: 0,
                xs: 2,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "secondary.main",
                  borderRadius: "50%",
                  height: 8,
                  width: 8,
                  mr: 1,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: isDarkMode ? '#ffffff' : 'secondary.main',
                }}
              >
                Ample
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginLeft: "10px",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "primary.main",
                  borderRadius: "50%",
                  height: 8,
                  width: 8,
                  mr: 1,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: isDarkMode ? '#ffffff' : 'primary.main',
                }}
              >
                Pixel Admin
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ height: 355 }}>
          <Chart
            options={optionssalesoverview}
            series={seriessalesoverview}
            type="bar"
            height="100%"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesOverview;
