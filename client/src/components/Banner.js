import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button  from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { useNavigate } from 'react-router-dom';
import logo from '../DreaMyJournalCat.svg'
import { logoutUser } from '../api/auth';

export default function Banner() {
  const navigate = useNavigate();
  
  const { setCurrentUser } = useContext(AppContext);
  async function handleLogout(){
    await logoutUser();
    navigate("/");
    setCurrentUser(null);
  }


  return (
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
          <Typography variant="h6" noWrap>
          <img src = {logo} style={{ height: 40 }}/>DreaMy Journal
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" onClick={handleLogout}><LogoutIcon/></Button>
      </Toolbar>
      </AppBar>
  );
}