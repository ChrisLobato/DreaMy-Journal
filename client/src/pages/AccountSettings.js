import { Typography, Avatar, Grid, Box, Divider, Toolbar } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { useContext } from 'react';
import { AppContext } from '../AppContext';

const AccountPage = () => {
    const { currentUser } = useContext(AppContext);

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Box sx={{ display: 'flex', flexDirection: "column",alignItems:"center",justifyContent: 'center', mt: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: deepPurple[500], width: 64, height: 64, fontSize: 28 }}>
                        {currentUser.username[0].toUpperCase()}
                    </Avatar>
                    <Box sx={{ ml: 2 }}>
                        <Typography variant="h5">{currentUser.username}</Typography>
                    </Box>
                </Box>

                <Divider sx={{ width: '100%', my: 2 }}/>
                
                <Grid container spacing={2}>
                    <Grid xs={4}>
                        <Typography color="text.secondary">Username</Typography>
                    </Grid>
                    <Grid xs={8}>
                        <Typography>{currentUser.username}</Typography>
                    </Grid>

                    <Grid xs={4}>
                        <Typography color="text.secondary">Email</Typography>
                    </Grid>
                    <Grid xs={8}>
                        <Typography>{currentUser.email}</Typography>
                    </Grid>

                    <Grid xs={4}>
                        <Typography color="text.secondary">Join Date</Typography>
                    </Grid>
                    <Grid xs={8}>
                        <Typography>{new Date(currentUser.createdAt).toLocaleDateString()}</Typography>
                    </Grid>
                </Grid>
            </Box>

        </Box>

    );
};

export default AccountPage;
