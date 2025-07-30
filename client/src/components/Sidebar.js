import {
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

export default function Sidebar(){
    const navigate = useNavigate();

    function handleSwitchToPlanner(){
        navigate("/home");
    }

    function handleSwitchToEntries(){
        navigate("/home/entries");
    }
    function handleSwitchToStats(){
        navigate("/home/stats");
    }
    function handleSwitchToAccountSettings(){
        navigate("/home/settings")
    }

    return(
        <Drawer variant="permanent" sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }} open={true}>
        <Toolbar />
        <List>
            <ListItem >
            <ListItemButton onClick={handleSwitchToPlanner}>
                <ListItemText primary="✅ Planner" />
            </ListItemButton>
            </ListItem>
            <ListItem>
            <ListItemButton onClick={handleSwitchToEntries}>
                <ListItemText primary="📓 Entries" />
            </ListItemButton>
            </ListItem>
            <ListItem>
            <ListItemButton onClick={handleSwitchToStats}>
                <ListItemText primary="🧠 Stats" />
            </ListItemButton>
            </ListItem>
            <ListItem>
            <ListItemButton onClick={handleSwitchToAccountSettings}>
                <ListItemText primary="⚙️ Account" />
            </ListItemButton>
            </ListItem>
        </List>
        </Drawer>
    );
}