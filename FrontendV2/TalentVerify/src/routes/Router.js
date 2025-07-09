import { lazy } from "react";
//import { Navigate } from "react-router-dom";


/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout/FullLayout.js"));
/****End Layouts*****/

/*****Pages******/
const Dashboard1 = lazy(() => import("../views/dashboards/Dashboard1.js"));
const DashboardEmployer = lazy(() => import("../views/dashboards/DashboardEmployer.js"));
const DashboardInterviewee = lazy(() => import("../views/dashboards/DashboardInterviewee.js"));
const PerformanceDashboard = lazy(() => import("../views/dashboards/PerformanceDashboard.js"));
const ProfileDashboard = lazy(() => import("../views/dashboards/ProfileDashboard.js"));
const SettingsDashboard = lazy(() => import("../views/dashboards/SettingsDashboard.js"));
const PendingResultsDashboard = lazy(() => import("../views/dashboards/PendingResultsDashboard.js"));

/*****Tables******/
const BasicTable = lazy(() => import("../views/tables/BasicTable.js"));

// form elements
const ExAutoComplete = lazy(() =>
  import("../views/FormElements/ExAutoComplete.js")
);
const ExButton = lazy(() => import("../views/FormElements/ExButton.js"));
const ExCheckbox = lazy(() => import("../views/FormElements/ExCheckbox.js"));
const ExRadio = lazy(() => import("../views/FormElements/ExRadio.js"));
const ExSlider = lazy(() => import("../views/FormElements/ExSlider.js"));
const ExSwitch = lazy(() => import("../views/FormElements/ExSwitch.js"));
// form layouts
const FormLayouts = lazy(() => import("../views/FormLayouts/FormLayouts.js"));

const DemoContainer = lazy(() => import("../components/interview/DemoContainer.js"));
const AddJobPosting = lazy(() => import("../components/jobs/components/AddJobPosting.js"));
const EmployerPostings = lazy(() => import("../components/jobs/components/EmployerPostings.js"));
const ViewAllPostings = lazy(() => import("../components/jobs/components/ViewAllPostings.js"));
const InterviewComponent = lazy(() => import("../components/interview/InterviewComponent.js"));
const AutomatedEmoDetector = lazy(() => import("../components/emotion/components/AutomatedEmoDetector.js"));
const IntegratedInterviewComponent = lazy(() => import("../components/interview/IntegratedInterviewComponent.js"));

/*****Routes******/

const ThemeRoutes = (props) => [
  {
    path: "/",
    element: <FullLayout setUserName = {props.setUserName}/>,
    children: [
      { path: "/", element: <></>},
      { path: "dashboards/dashboard1", exact: true, element: <Dashboard1 /> },
      { path: "tables/basic-table", element: <BasicTable /> },
      { path: "/form-layouts/form-layouts", element: <FormLayouts /> },
      { path: "/form-elements/autocomplete", element: <ExAutoComplete /> },
      { path: "/form-elements/button", element: <ExButton /> },
      { path: "/form-elements/checkbox", element: <ExCheckbox /> },
      { path: "/form-elements/radio", element: <ExRadio /> },
      { path: "/form-elements/slider", element: <ExSlider /> },
      { path: "/form-elements/switch", element: <ExSwitch /> },
      { path: '/loggedInEmployer', element: <DashboardEmployer />},
      { path: "/loggedInInterviewee", element: <DashboardInterviewee />},
      { path: "/dashboards/intervieweeDashboard", element: <DashboardInterviewee />},
      { path: "/dashboards/intervieweePerformance", element: <PerformanceDashboard />},
      { path: "/dashboards/intervieweeProfile", element: <ProfileDashboard />},
      { path: "/dashboards/intervieweeSettings", element: <SettingsDashboard />},
      { path: "/dashboards/jobPosting", element:<EmployerPostings userName = {props.userName}/>},
      { path: "/dashboards/addJobPosting", element:<AddJobPosting userName = {props.userName}/>},
      { path: "/dashboards/intervieweeSearch", element:< ViewAllPostings/>},
      { path: "/dashboards/intervieweependingResult", element: <PendingResultsDashboard />},
      { path: "dashboards/applyInterview", element:<IntegratedInterviewComponent />},
      { path: "/dashboards/intervieweedemo", element:< DemoContainer/>},
      { path: "/dashboards/AutomatedEmoDetector", element:< AutomatedEmoDetector/>},
    ],
  },
];

export default ThemeRoutes;

