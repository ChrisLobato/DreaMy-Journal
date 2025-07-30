import { useRef } from 'react';
import {
  Typography,
  Button,
  Paper,
} from '@mui/material';
import Badge from '@mui/material/Badge';
import CreateIcon from '@mui/icons-material/Create';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';



import dayjs from 'dayjs';


export default function CalendarPlanner({isLoading, setIsLoading, selectedDate, setSelectedDate, fetchHighlightedDays, highlightedDays, setHighlightedDays, currentUser,handleNewEntry}) {
    const requestAbortController = useRef(null);

    function ServerDay(props) {
        const { highlightedDays = [], day, outsideCurrentMonth, ...other} = props;
    
        //check if current day is in the days that a entry was written
        const isSelected = !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;
    
        //return badge
        return (
          <Badge
            key = {props.day.toString()}
            overlap = "circular"
            badgeContent = {isSelected ? '✅' : undefined}
          >
            <PickersDay {...other} outsideCurrentMonth = {outsideCurrentMonth} day = {day}/>
          </Badge>
        )
    }
    const handleMonthChange = (date) =>{
        if(requestAbortController.current){
        //abort a useless request
        requestAbortController.current.abort();
        }
        setIsLoading(true);
        setHighlightedDays([]);
        fetchHighlightedDays(date,currentUser.email);
    } 

    return(
        <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Planner</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* Can add an MUI badge to a custom component for the calendar days*/}
            <DateCalendar 
                value= {selectedDate} 
                loading = {isLoading}
                shouldDisableDate={(day) => day.isAfter(dayjs())}
                onChange={setSelectedDate}
                onMonthChange={handleMonthChange}
                renderLoading={()=> <DayCalendarSkeleton/>} 
                slots={{day: ServerDay}}
                slotProps={{day: {highlightedDays}}}
            />
            </LocalizationProvider>
            <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={handleNewEntry}>
            <CreateIcon/>
            </Button>
        </Paper>
    );
}