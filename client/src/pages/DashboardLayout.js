import { Box } from "@mui/material"
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Banner from "../components/Banner";

//Use of Outlet meanas that child components inside this component will
//render differently depending on what the route is
//i.e. Outlet gets swapped for watever real route needs to be rendered
// the route will depend on having a main parent route and ensuring that entries,stats etc are the child routes in
// of the parent route
export default function DashboardLayout() {


    return(
        // create a side bar component
        <Box sx={{ display: 'flex' }}>
            <Banner/>
            <Sidebar/>
            {/* The main content of the current tab */}
            <Outlet/>

        </Box>
    );
}