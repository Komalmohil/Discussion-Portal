const express = require('express');
const path = require('path');
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(auth);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

const questions = require('./routes/question');
app.use('/api/questions', questions);

app.get('/', (req, res) => {
  res.render('disapp'); 
});
const MONGO_URI = process.env.MONGO_URI;
const PORT = 5000;
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('DB Error:', err));
