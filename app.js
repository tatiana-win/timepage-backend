const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const cookieSession = require("cookie-session");
require('dotenv').config({ path: !!process.env.NODE_ENV ? `.env.${ process.env.NODE_ENV }` : '.env'});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const notesRouter = require('./routes/notes');
const testRouter = require('./routes/test');
const { testDbConnection } = require("./db");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors({
    credentials: true,
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    cookieSession({
        name: "timepage-session",
        secret: process.env.COOKIE_SECRET, // should use as secret environment variable
        domain: 'http://localhost:4200',
        maxAge: 24 * 60 * 60 * 1000
        // httpOnly: true
    })
);

testDbConnection();

app.use('/', indexRouter);
app.use('/auth', usersRouter);
app.use('/notes', notesRouter);
app.use('/test', testRouter);

module.exports = app;
