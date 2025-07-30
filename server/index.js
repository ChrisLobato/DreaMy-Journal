const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser'); // similar to cors this enables some convenient functionality for us and will lets us access the cookie portion of a request
const port = 8000;
// const mongoose = require('mongoose')
const authRoutes = require('./routes/auth.js');
const journalRoutes = require('./routes/journal.js'); // routes for journal
require('dotenv').config();

// var mongoDB = 'mongodb://127.0.0.1:27017/test';
// mongoose.connect(mongoDB,{useNewUrlParser: true, useUnifiedTopology: true})

// var db = mongoose.connection
// db.on('error',console.error.bind(console,'MongoDB connection error: '));
//Weird that on the last time i ran this it allowed me to make requests without the extra params but this time was required
app.use(cors(
    {origin: 'http://localhost:3000', // Update this with your frontend's origin
credentials: true}));
app.use(express.urlencoded({ extended: false })); // not sure about this
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRoutes)// for some reason double parenthesis is needed but i think that in some examples ive seen no double parenthesis
app.use('/api/journal',journalRoutes);

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});
