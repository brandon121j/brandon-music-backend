var express = require('express');
var cookieParser = require('cookie-parser');
var cors = require('cors')

var app = express();

const userRouter = require('./routes/user/userRouter')

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', userRouter);

module.exports = app;
