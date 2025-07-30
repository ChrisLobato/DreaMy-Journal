import { useContext, useEffect, useState, useRef } from 'react';
import {
  Toolbar,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';

import dayjs from 'dayjs';
import axios from 'axios';
import { AppContext } from '../AppContext';
import CalendarPlanner from '../components/CalendarPlanner';
axios.defaults.withCredentials = true;
// const drawerWidth = 240;

export default function HomePage() {
  const requestAbortController = useRef(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [modalOpen, setModalOpen] = useState(false);
  const [entryText, setEntryText] = useState('');
  const [entries, setEntries] = useState([]);
  const [recentEntries, setRecentEntries] = useState([]);
  const { currentUser, setCurrentUser } = useContext(AppContext);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [isEditing, setIsEditing] = useState(false); //TODO add for some conditional rendering of modal
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(()=>{
    //possible alternative is to decouple into 2 useEffects where second one depends on currentUser being updated
    const fetchData = async () =>{
      const userLoggedIn = await axios.get("http://localhost:8000/api/auth/loggedIn")
      const {email, username, createdAt} = userLoggedIn.data;
      setCurrentUser({email, username, createdAt});
      fetchRecentEntries(email)
      fetchHighlightedDays(selectedDate,email); //gets the entries that display on the calendar so we can view and edit
    }
    fetchData();
  },[]);



  const handleNewEntry = () => {
    //triggered when someone clicks the new Entry button
    //TODO input old text in there if there is text
    const selectedEntry = entries.find((entry) =>{
      const formattedDate = dayjs(entry.createdAt);
      //use dayjs.isSame() to compare?
      if (formattedDate.date() === selectedDate.date()){
        return entry
      }
      return null;
    });
    if (selectedEntry){
      setEntryText(selectedEntry.text);
      setIsEditing(true);
    }
      setModalOpen(true);
  }
  const handleModalClose = () => {
    setModalOpen(false);
    setIsEditing(false);
    setEntryText("");
  };
  const handleEntrySubmit = () => {
    // TODO: send `entryText` and `selectedDate` to backend
    try{
      axios.post("http://localhost:8000/api/journal/entry/" + currentUser.email,{
        text: entryText,
        date: selectedDate.$d
      }).then((res) => {
        fetchRecentEntries(currentUser.email);
        fetchHighlightedDays(selectedDate,currentUser.email);
      });
    }catch (err) {
      // console.log("problem sending request " + err)
    }
    // console.log(`Saving entry for ${selectedDate.format('YYYY-MM-DD')}:`, entryText);
    setModalOpen(false);
    setIsEditing(false);
    setEntryText('');
  };
  //function to crudely generate a list of typography components that display the most recent entries
  function generateListOfRecentEntries(){
    return(
      recentEntries.map((entry) =>{
        const entryDate = new Date(entry.createdAt);
        const formattedDate = entryDate.toDateString();
        return(
          <Typography key = {entryDate}>
          {formattedDate}: {entry.text.slice(0,50) + "..."}
        </Typography>
        );
      })
    );
  } 

  async function fetchEntriesByMonth(date, email, { signal }) {
    //get the year and month selected
    const year = date.year();
    const month = date.month() + 1; //dayjs months 0 indexed

    const entriesQuery = await axios.get("http://localhost:8000/api/journal/entriesbymonth/" + email,{
      params: {
        year: year,
        month: month 
      }
    });

    return entriesQuery.data.userEntriesByMonth;
  }
  async function fetchRecentEntries(email) {
    const recentEntriesQuery = await axios.get("http://localhost:8000/api/journal/entries",{
        params: {
            email,
            page:1,
            limit:5,
            search: " ",
            sort: "desc"
        }
    });
    const fiveMostRecentEntries = recentEntriesQuery.data.entries.slice(0,5); // will return a list in descending order of 5 most recent entries
    setRecentEntries(fiveMostRecentEntries);
  }

  const fetchHighlightedDays = (date, email) =>{
    //TODO Add abort controller to avoid too many quick queries if user swaps between the months quickly

    const controller = new AbortController(); //to help stop too many quick requests since switching month will send a new request for journal entries
    fetchEntriesByMonth(date, email, {signal: controller.signal})
    .then((entries)=>{

      const mappedEntries = entries.map((entry) =>{
        return dayjs(entry.createdAt).date(); //creates the dayjs object and then gets the day number these remove a day likely because 0 indexed
      });
      setEntries(entries);
      setHighlightedDays(mappedEntries);
      setIsLoading(false);
    })
    .catch((err) =>{ 
      if (err.name!== 'AbortError'){
        throw err;
      }
    });

    requestAbortController.current = controller
  }

  return (
    <>
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Grid container spacing={2}>
          <Box sx = {{minWidth: '40%', maxWidth: '45%', width:'100%'}}>
            <Grid >
              <CalendarPlanner
                isLoading = {isLoading}
                setIsLoading= {setIsLoading}
                selectedDate ={selectedDate}
                setSelectedDate={setSelectedDate}
                setEntries={setEntries}
                fetchHighlightedDays = {fetchHighlightedDays}
                highlightedDays = {highlightedDays}
                setHighlightedDays={setHighlightedDays}
                currentUser={currentUser}
                handleNewEntry = {handleNewEntry}
              />
            </Grid>
          </Box>
          <Box sx = {{width: '45%'}}>
            <Grid >
              <Paper elevation={3} sx={{ p: 2, overflowY: 'auto'}}>
                <Typography variant="h6">Recent Entries</Typography>
                {/* Replace with dynamic list */}
                <Box mt={2}>
                  {generateListOfRecentEntries()}
                </Box>
              </Paper>
            </Grid>
          </Box>
        </Grid>
      </Box>

      {/* Modal for Entry */}
      <Dialog open={modalOpen} onClose={handleModalClose} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? "Update Journal Entry " : "New Journal Entry "}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" gutterBottom>
            Date: {selectedDate.format('MMMM D, YYYY')}
          </Typography>
          <TextField
            multiline
            rows={6}
            fullWidth
            placeholder="Last night I dreamt that..."
            value={entryText}
            onChange={(e) => setEntryText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handleEntrySubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
