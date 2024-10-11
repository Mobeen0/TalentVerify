import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';

const Menuitems = [
  {
    title: "JobSearch",
    icon: SearchOutlinedIcon,
    href: "/dashboards/intervieweeSearch",
  },
  {
    title: "PendingResult",
    icon: PendingActionsOutlinedIcon,
    href: "/dashboards/intervieweependingResult",
  },
  {
    title: "SetupInterview",
    icon: EventNoteOutlinedIcon,
    href: "/dashboards/intervieweedemo",
  }
];

export default Menuitems;