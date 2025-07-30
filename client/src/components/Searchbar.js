
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({searchText, setSearchText, handleSearch}){

    const handleEnterPress = (e) =>{
        if(e.key === 'Enter'){
            handleSearch();
        } 
    }


    return (
        <TextField
        fullWidth
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={handleEnterPress}
        placeholder={"Search for journal entry..."}
        variant="outlined"
        size="small"
        color="secondary"
        sx={{
            maxWidth: 400,
        }}
        slotProps={{
            startAdornment: (
            <InputAdornment position="start">
                <SearchIcon />
            </InputAdornment>
            ),
        }}
        />
  );

}