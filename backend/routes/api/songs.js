const express = require("express");

const router = express.Router();

const mongoose = require('mongoose');
const Song = mongoose.model('Song');

router.get('/', function(req, res, next) {
  res.json({
    message: "Getting the songs"
  });
});


module.exports = router;

// test