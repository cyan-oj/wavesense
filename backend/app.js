const express = require('express');
// const path = require('path'); //may delete
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('./models/User');
require('./models/Song');
require('./models/Playlist')
require('./config/passport');
const csurf = require('csurf');
const debug = require('debug');
// const expressfileupload = require('express-fileupload');

const app = express();
const passport = require('passport');


const cors = require('cors');
const { isProduction } = require('./config/keys');


const usersRouter = require('./routes/api/users');
const csrfRouter = require('./routes/api/csrf');
const songsRouter = require('./routes/api/songs')
const playlistsRouter = require('./routes/api/playlists')

app.use(passport.initialize());



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(expressfileupload)

if (!isProduction) {
    app.use(cors());
}

app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);
    
app.use('/api/users', usersRouter);
app.use('/api/csrf', csrfRouter);
app.use('/api/songs', songsRouter);
app.use('/api/playlists', playlistsRouter)

if (isProduction) {
    const path = require('path');
    // Serve the frontend's index.html file at the root route
    app.get('/', (req, res) => {
      res.cookie('CSRF-TOKEN', req.csrfToken());
      res.sendFile(
        path.resolve(__dirname, '../frontend', 'build', 'index.html')
      );
    });
  
    // Serve the static assets in the frontend's build folder
    app.use(express.static(path.resolve("../frontend/build")));
  
    // Serve the frontend's index.html file at all other routes NOT starting with /api
    app.get(/^(?!\/?api).*/, (req, res) => {
      res.cookie('CSRF-TOKEN', req.csrfToken());
      res.sendFile(
        path.resolve(__dirname, '../frontend', 'build', 'index.html')
      );
    });
}

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.statusCode = 404;
    next(err);
});

const serverErrorLogger = debug('backend:error');

app.use((err, req, res, next) => {
    serverErrorLogger(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        statusCode,
        errors: err.errors
    })
});




module.exports = app;
