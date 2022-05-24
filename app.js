var express = require('express');
var cookieParser = require('cookie-parser');
var cors = require('cors')

var app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());




module.exports = app;
