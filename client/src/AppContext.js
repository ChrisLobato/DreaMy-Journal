import React, { createContext, useState } from "react";


export const AppContext = createContext();

//This will pretty much encapsulate some of the global stuff that i think all the components might need
//hopefully this should make it easier to retrive things like the current page, logged in user, and if the person is logged in 
//This way in other components we use useContext() to access this stuff

export function AppContextProvider(props){

    const [isLoggedIn,setIsLoggedIn] = useState(false);
    const [activePage, setActivePage] = useState("SignIn"); // SignIn, SignUp
    const [currentUser, setCurrentUser] = useState(null); //object w/ username and email fields
    const [activeJournal, setActiveJournal] = useState(null);
    return(
        <AppContext.Provider value = {
            {isLoggedIn,setIsLoggedIn,
            activePage,setActivePage,
            currentUser,setCurrentUser,
            activeJournal,setActiveJournal
            }}
            >
            {props.children}
        </AppContext.Provider>
    )
 }