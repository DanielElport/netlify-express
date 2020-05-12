'use strict';
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const request = require('request');
const router = express.Router();


app.use((req, res, next) => {

  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

  next();
});
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => {

  const url = req.url.substring(1);
  // get data from request url
  request( url,{
    uri: url,
    method: 'GET',
    encoding: null
  }, (error, response, body) => {

    if (!error) {

      // copy headers
      Object.keys(response.headers).forEach(key => {
        res.setHeader(key, response.headers[key]);
      });

      // forward http response
      res.status(200);
      res.send(body);

    } else {

      // handle error
      res.status(400);
      res.json({error: error.message});
    }
  });

});

module.exports = app;
module.exports.handler = serverless(app);
