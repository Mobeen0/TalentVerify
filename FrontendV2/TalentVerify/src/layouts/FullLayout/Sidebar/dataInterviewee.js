import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';

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
    title: "InterviewDemo",
    icon: EventNoteOutlinedIcon,
    href: "/dashboards/AutomatedEmoDetector",
  },
  {
    title: "ApplyInterview",
    icon: TaskAltOutlinedIcon,
    href: "/dashboards/applyInterview",
  }
];



export default Menuitems;
