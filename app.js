const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const questions= require('./routes/question');
app.use('/api/questions', questions);

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"public","disapp.html"))
})


mongoose.connect(process.env.mongodb)
.then(() => {
    console.log('MongoDB Connected');
app.listen(3000, () => console.log(`Server is running`));

}).catch(err => console.error('DB Error:', err));



