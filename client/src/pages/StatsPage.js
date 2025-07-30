import { CardContent, Grid, Toolbar, Typography, Card } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box } from '@mui/material'
import InsightsIcon from '@mui/icons-material/Insights';
import TodayIcon from '@mui/icons-material/Today';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext';
axios.defaults.withCredentials = true;

export default function StatsPage(){
    const { currentUser } = useContext(AppContext);
    const [stats, setStats] = useState(null);
    
    useEffect(()=>{
        async function fetchStats(){
            const statsQuery = await axios.get("http://localhost:8000/api/journal/stats/" + currentUser.email)
            .then((res)=>{
                setStats(res.data);
            });
        }
        
        fetchStats();
    }, [])

    //function to render the stats bar with cards
    function handleStatsBar(){
        if(stats){
            const statsForCards = [
            {
            label: 'Total Entries',
            value: stats.totalEntries,
            icon: <InsightsIcon fontSize="large" color="primary" />,
            },
            {
            label: 'Longest Streak',
            value: `${stats.longestStreak} days`,
            icon: <TodayIcon fontSize="large" color="secondary" />,
            },
            {
            label: 'Avg. Words / Entry',
            value: stats.avgWordCount,
            icon: <TextFieldsIcon fontSize="large" sx={{ color: '#9c27b0' }} />,
            },
            ];
        
            return(
                <Grid container spacing={3} columns= {12} justifyContent="center" wrap="wrap">
                    {statsForCards.map((aStat) => (
                    <Grid key = {aStat.label} size={{xs:12, sm:6, md: 4 }}>
                        <Card
                            key = {aStat.label}
                            sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: 2,
                            boxShadow: 3,
                            borderRadius: 3,
                            }}
                        >
                            <div style={{ marginRight: 16 }}>{aStat.icon}</div>
                            <CardContent>
                                <Typography variant='h8' color='text.secondary'> {aStat.label}</Typography>
                                <Typography variant ='h6'>{aStat.value}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    ))}
                    
                </Grid>
            )

        }
        return(<></>)

    }

    function handleRenderLineChart(){
        if(stats && stats.entriesByDate){

            const dates = Object.keys(stats.entriesByDate).map((dateString) => new Date(dateString).getTime());
            const counts = Object.values(stats.entriesByDate);
            return(
                <LineChart
                    xAxis={[{ data: dates, scaleType: 'time', valueFormatter: (date) => new Date(date).toLocaleDateString(), label: 'Week Of'}]}
                    yAxis = {[{label: "Entry Count"}]}
                    series={[{ data: counts, color: "#f48fb1", label: 'Entries by week' }]}
                    height={300}
                    title='Journal Entries Over Time'
                />
            )
        }
        return(<></>)
    }

    return(
        <>
             <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar/>
                {handleStatsBar()}
                <Box minHeight={30}></Box>
                <Box sx={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                    <Typography variant='h6'> Journal Entries Over Time </Typography>
                </Box>
                {handleRenderLineChart()}
                

             </Box>
        
        
        
        </>
        
    );
    
}