// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

//Date Range picker is a part of MUI Commercial license so this is a makeshift range selection
export default function CalendarPicker({start, end,setDateRange}) { 
    
    //will format the date to be the start and end of the month selcted so that itll be easier to query in the backend
    function normalizeStartDate(date){
        if(date){
            const normalizedStartDate = new Date(date.year(), date.month(), 1);
            setDateRange({start: dayjs(normalizedStartDate), end}) //TODO look into using dayjs setters to update the value, minimize lines of code
        }
        else{
            setDateRange({start: date, end})
        }
    }
    function normalizeEndDate(date){
        if(date){
            const normalizedEndDate = new Date(date.year(), date.month() + 1, 0);
            setDateRange({start, end: dayjs(normalizedEndDate)}) //TODO look into using dayjs setters to update the value, minimize lines of code
        }
        else{
            setDateRange({start, end: date})
        }
    }


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
       <DatePicker label={'Start Date'} views={['month', 'year']} 
        value = {start}
        onChange={(newDate) => normalizeStartDate(newDate)}
        slotProps={{
              field: { clearable: true,},
            }}
       />
       <DatePicker label={'End Date'} views={['month', 'year']} 
        value = {end}
        onChange={(newDate) => normalizeEndDate(newDate)}
        shouldDisableDate={(day) => day.isBefore(start)}
        slotProps={{
              field: { clearable: true,},
            }}
       />
    </LocalizationProvider>
  );
}