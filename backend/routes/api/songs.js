const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Song = mongoose.model('Song');

router.get('/', async (req, res) => {

  const songs = await Song.find();
  return res.json(songs);

});

router.get('/:title', async (req, res) => {
  const songs = await Song.find();

  const song = songs.find( (song) => {
    return song.title.toLowerCase().includes(req.params.title);
  }) // Is there a Regex way? Who knows?

  if(song){
    return res.json(song);
  } else {
    return res.json({message: "no song with that title"})
  }

});


module.exports = router;
