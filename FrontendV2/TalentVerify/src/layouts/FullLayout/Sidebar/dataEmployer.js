import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

const Menuitems = [
  {
    title: "Dashboard",
    icon: DashboardOutlinedIcon,
    href: "/loggedInEmployer",
  },
  {
    title: "JobPostings",
    icon: WorkOutlineOutlinedIcon,
    href: "/dashboards/jobPosting",
  },
  {
    title: "AddJobPosting",
    icon: AddBoxOutlinedIcon,
    href: "/dashboards/addJobPosting"
  }
];

export default Menuitems;