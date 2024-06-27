const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
require('dotenv').config();
const connectDb = require('./dbs/init.mysql');
const path = require('path');
const app = express();

// init middleware
app.use(cors());
app.use(morgan("dev"))
app.use(helmet({
    crossOriginResourcePolicy: false,
}))
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use('/src/uploads', express.static(path.join(__dirname, 'uploads')));

// init db
connectDb()

// init routes
app.use('', require('./routes'));

// handling error

module.exports = app; 