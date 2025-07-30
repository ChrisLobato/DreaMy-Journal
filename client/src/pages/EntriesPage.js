import {
    Box,
    Grid,
    Card,
    CardContent,
    // CardMedia,
    Pagination,
    CardHeader,
    Toolbar,
    Typography,
    Button,
    CardActionArea,
    InputLabel,
    MenuItem,
    Select,
    FormControl,
    TextField
} from "@mui/material"

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



import axios from "axios"
import { useContext, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { AppContext } from "../AppContext";
import SearchBar from "../components/Searchbar";
import CalendarPicker from "../components/CalendarPickerRange";
axios.defaults.withCredentials = true;


export default function EntriesPage() {
    const [entries, setEntries] = useState([]);
    const { currentUser, setCurrentUser } = useContext(AppContext);
    const [dialogText, setDialogText] = useState("");
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [advancedOpen, setAdvancedOpen] = useState(false); //state variables for advanced search dialog
    const [totalEntries, setTotalEntries] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [sort, setSort] = useState("desc");
    const [dateRange, setDateRange] = useState({ start: null, end: null });
    const descriptionElementRef = useRef(null);

    //State variables for editing modal
    const [modalOpen, setModalOpen] = useState(false);
    const [entryText, setEntryText] = useState("");


    useEffect(() => {
        async function fetchData() {
            if (!currentUser) {
                const userLoggedIn = await axios.get("http://localhost:8000/api/auth/loggedIn")
                const { email, username, createdAt } = userLoggedIn.data;
                setCurrentUser({ email, username, createdAt });
                await axios.get("http://localhost:8000/api/journal/entries", {
                    params: {
                        email,
                        page: 1,
                        limit: 9,
                        sort: "desc"
                    }
                })
                    .then((res) => {
                        setTotalEntries(Number(res.data.totalReturned));
                        setEntries(res.data.entries);
                    });
            }
            else {
                await axios.get("http://localhost:8000/api/journal/entries/", {
                    params: {
                        email: currentUser.email,
                        page: 1,
                        limit: 9,
                        sort: "desc"
                    }
                })
                    .then((res) => {
                        setTotalEntries(Number(res.data.totalReturned));
                        setEntries(res.data.entries);
                    });
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        //TODO new request to make once user moves to next page
        async function fetchNewPage() {
            await axios.get("http://localhost:8000/api/journal/entries/", {
                params: {
                    email: currentUser.email,
                    page: currentPage,
                    limit: 9,
                    search: searchText,
                    sort: sort,
                    startDate: dateRange.start,
                    endDate: dateRange.end
                }
            })
                .then((res) => {
                    setTotalEntries(Number(res.data.totalReturned));//for page switching might not require updating total count cuz it might cause unneccessary rerender
                    setEntries(res.data.entries);
                });
        }
        fetchNewPage();
    }, [currentPage]);

    useEffect(() => {
        if (dialogOpen) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [dialogOpen]);

    const handleSearch = async () => {
        //TODO insert axios request for getting entries based off the search text
        await axios.get("http://localhost:8000/api/journal/entries/", {
            params: {
                email: currentUser.email,
                page: 1,
                limit: 9,
                search: searchText,
                sort: "desc",
                startDate: null,
                endDate: null
            }
        })
            .then((res) => {
                setCurrentPage(1);// reset us back to the first page
                setTotalEntries(Number(res.data.totalReturned));
                setEntries(res.data.entries);
            });
    }
    const handleSortDropDown = (e) => {
        setSort(e.target.value);
    }

    const handlePageSwitch = (event, page) => {
        setCurrentPage(page);
    }
    //functions for handling entry dialogs
    const handleClickOpen = (text, title) => () => {
        setDialogText(text);
        setDialogTitle(title)
        setDialogOpen(true);
    }
    const handleClose = () => {
        setDialogOpen(false);
    }

    //functions or handling opening and closing advanced search dialog
    const handleAdvancedOpen = () => setAdvancedOpen(true);
    const handleAdvancedClose = () => {
        setAdvancedOpen(false)
        setSort("desc");
        setDateRange({ start: null, end: null });
    };//TODO swap to clear current Search Filters

    const handleAdvancedSearch = async () => {
        await axios.get("http://localhost:8000/api/journal/entries/", {
            params: {
                email: currentUser.email,
                page: 1,
                limit: 9,
                search: searchText,
                sort: sort,
                startDate: dateRange.start,
                endDate: dateRange.end
            }
        })
            .then((res) => {
                setCurrentPage(1);// reset us back to the first page
                setTotalEntries(Number(res.data.totalReturned));
                setEntries(res.data.entries);
            });
        setAdvancedOpen(false);
    }

    const handleModalOpen = () => {
        setDialogOpen(false);
        setEntryText(dialogText);
        setModalOpen(true);
    }
    const handleModalClose = () => {
        setModalOpen(false);
    }
    const handleEntrySubmit = () => {
        try {
            axios.post("http://localhost:8000/api/journal/entry/" + currentUser.email, {
                text: entryText,
                date: dayjs(dialogTitle).$d
            }).then((res) => {
                //refetch the entries 
                handleSearch();
            });
        } catch (err) {
            // console.log("problem sending request " + err)
        }
        setModalOpen(false);
        setEntryText('');

    }


    function generateEntryCards() {
        //actual cards
        const filledCards = entries.map((entry) => {
            const createdAtDayjs = dayjs(entry.createdAt).format('MMMM D, YYYY')
            return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={entry.createdAt}>
                    <Card sx={{ height: 100 }}>
                        <CardActionArea onClick={handleClickOpen(entry.text, createdAtDayjs)}>
                            {/* Unusued components for now but plan to implement image generation which will take up this space */}
                            <CardHeader title={createdAtDayjs} />
                            {/* <CardMedia/> */}
                            <CardContent>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {entry.text.slice(0, 50) + "..."}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            );
        });
        //empty cards created to ensure proper spacing is maintained aka filler space
        const emptySlots = 9 - filledCards.length;
        const emptyCards = Array.from({ length: emptySlots }).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`empty-card-${index}`}>
                <Box sx={{ height: 100 }} />
            </Grid>
        ));
        return [...filledCards, ...emptyCards];
    }

    return (
        <>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <SearchBar sx={{ p: 15 }} searchText={searchText} setSearchText={setSearchText} handleSearch={handleSearch} />
                <Button onClick={handleAdvancedOpen}>Advanced Search</Button>
                <Grid container sx={{ minHeight: 450 }} columnSpacing={2} columns={12} alignItems={"flex-start"}>
                    {generateEntryCards()}
                </Grid>
                <Pagination count={Math.ceil(totalEntries / 9)} color="secondary" onChange={handlePageSwitch} />
            </Box>
            {/* Dialog for displaying the entry that the user selected */}
            <>
                <Dialog
                    open={dialogOpen}
                    onClose={handleClose}
                    scroll={"paper"}
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                >
                    <DialogTitle> {dialogTitle} </DialogTitle>
                    <DialogContent dividers={true}>
                        <DialogContentText
                            id="scroll-dialog-description"
                            ref={descriptionElementRef}
                            tabIndex={-1}
                        >
                            {dialogText}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}> Close </Button>
                        <Button onClick={handleModalOpen}> Edit </Button>
                    </DialogActions>
                </Dialog>
            </>
            {/* Dialog for advanced search features */}
            <Dialog
                open={advancedOpen}
                onClose={handleAdvancedClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Advanced Search</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <FormControl>
                            <InputLabel id="sort-by-select-label">Sort by</InputLabel>
                            <Select fullWidth
                                labelId="sort-by-select-label"
                                id="sortby-select"
                                value={sort}
                                label="Sort by"
                                onChange={handleSortDropDown}
                            >
                                <MenuItem value={"asc"}>Oldest</MenuItem>
                                <MenuItem value={"desc"}>Newest</MenuItem>
                            </Select>
                        </FormControl>
                        <CalendarPicker start={dateRange.start} end={dateRange.end} setDateRange={setDateRange} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAdvancedClose}> Cancel </Button>
                    <Button onClick={handleAdvancedSearch}> Search </Button>
                </DialogActions>
            </Dialog>
            {/* Modal For Editing Entry  */}
            <Dialog open={modalOpen} onClose={handleModalClose} fullWidth maxWidth="sm">
                <DialogTitle>Update Journal Entry</DialogTitle>
                <DialogContent>
                    <Typography variant="subtitle2" gutterBottom>
                        Date: {dayjs(dialogTitle).format('MMMM D, YYYY')}
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
    )

}