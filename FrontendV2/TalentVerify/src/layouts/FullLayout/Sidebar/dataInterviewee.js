import {
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  PlayCircle as PlayCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Send as SendIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

const Menuitems = [
  {
    title: "Dashboard",
    icon: DashboardIcon,
    href: "/dashboards/intervieweeDashboard",
  },
  {
    title: "Job Management",
    icon: WorkIcon,
    href: "/dashboards/intervieweeSearch",
  },
  {
    title: "Interview Demo",
    icon: PlayCircleIcon,
    href: "/dashboards/intervieweedemo",
  },
  {
    title: "Pending Results",
    icon: HourglassEmptyIcon,
    href: "/dashboards/intervieweependingResult",
  },
  {
    title: "Apply Interview",
    icon: SendIcon,
    href: "/dashboards/applyInterview",
  },
  {
    title: "Performance",
    icon: AssessmentIcon,
    href: "/dashboards/intervieweePerformance",
  },
  {
    title: "Profile",
    icon: PersonIcon,
    href: "/dashboards/intervieweeProfile",
  },
  {
    title: "Settings",
    icon: SettingsIcon,
    href: "/dashboards/intervieweeSettings",
  },
];

export default Menuitems;
