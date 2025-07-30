import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from '@emotion/react';
import drieeemtheme from './theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme = {drieeemtheme}>
      <App />
    </ThemeProvider>
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

/**TODO 7/18 
 * preview tooltip on hover over a day with an entry
 * Highlight today in  a special color
 * Planner tab with existing calendar (decouple components)
 * Entries Tab with all entries in a list format
 * Stats insights tab (will mostly consist of dashboard stats)
 * Settings tab
*/