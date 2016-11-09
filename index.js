'use strict'
const express          = require('express');
const fs               = require('fs');
const path             = require('path');
const bodyParser       = require('body-parser');
const expressValidator = require('express-validator');
const cors             = require('cors');
const morgan           = require('morgan');
const mongoose         = require('mongoose');
const request          = require('request');
const moment           = require('moment');
const async            = require('async');
const config           = require('./config/config');
const app              = express();

const PORT       = process.env.PORT || 5000;

/*
 * WEBPACK HMR
 *
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.config')


const compiler = webpack(webpackConfig)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }))
app.use(webpackHotMiddleware(compiler))
 *
 */

//Disable header to prevent express detection
app.disable('x-powered-by');
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
//this line must be immediately after bodyParser()
app.use(expressValidator());
// use morgan to log requests to the console
app.use(morgan('dev'));

// const postgresDB = require("./models/index");

/*
 * Mongoose DB connection
 */

mongoose.connect(config.mongoDB);
console.log(config.mongoDB);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', (cb) => {
  console.log("successfully opened");
});

/*
 * Mongoose models
 */

require('./models/listing');

const Listing = mongoose.model('Listing');

/*
 * Routes
 */

const data = require('./routes/data');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/data/:city/regions', data.regions);
app.get('/api/data/:city/:region', data.regionData);

const server = app.listen(PORT, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at', host, port);
});

//Expose our server for testing purposes
module.exports = server;