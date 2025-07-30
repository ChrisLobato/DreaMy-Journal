import './App.css';
import { AppContextProvider } from './AppContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import RegisterScreen from './pages/RegisterScreen';
import LoginScreen from './pages/LoginScreen';
import HomePage from './pages/HomePage';
import DashboardLayout from './pages/DashboardLayout';
import EntriesPage from './pages/EntriesPage';
import StatsPage from './pages/StatsPage';
import AccountSettings from './pages/AccountSettings';

function App() {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route path = "/" element = {<Navigate to = "/login" />} />
          <Route path = "/login" element = {<LoginScreen/>} />
          <Route path = "/register" element = {<RegisterScreen/>} />
          <Route path = "/home" element = {<DashboardLayout/>}>
            <Route index element = {<HomePage/>}/>
            <Route path = "entries" element = {<EntriesPage/>}/>
            <Route path = "stats" element = {<StatsPage/>}/>
            <Route path = "settings" element = {<AccountSettings/>}/>
          </Route>
        </Routes>
      </Router>
    </AppContextProvider>
  );
}
//index element means that the current definition for what componet should render should belong to the parent route
//in this case the parent is just /home which is the parent component of dashboard layout
//the child routes get swapped in for outlet
export default App;
