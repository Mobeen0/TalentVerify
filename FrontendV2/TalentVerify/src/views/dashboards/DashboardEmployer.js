import React from "react";
import { Grid, Box } from "@mui/material";

import {
  BlogCard,
  SalesOverview,
  ProductPerformance,
  DailyActivities,
} from "./dashboard1-components";

import {
  PerformanceOverview,
  CandidateBudget
} from "./dashboardEmployer-components"

const DashboardEmployer = () => {
  // 2

  return (
    <Box>
      <Grid container spacing={0}>
        {/* ------------------------- row 1 ------------------------- */}
        <Grid item xs={12} lg={12}>
          <PerformanceOverview />
        </Grid>
        {/* ------------------------- row 2 ------------------------- */}
        <Grid item xs={12} lg={4}>
          <DailyActivities />
        </Grid>
        <Grid item xs={12} lg={8}>
          <CandidateBudget />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardEmployer;
