const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Song = mongoose.model('Song');

router.get('/', async (req, res) => {

  const songs = await Song.find();
  return res.json(songs);

});

module.exports = router;