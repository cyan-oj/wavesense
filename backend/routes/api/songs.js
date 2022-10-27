const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Song = mongoose.model('Song');
require('dotenv').config()

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const {S3Client} = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: 'us-east-1'
});

const upload = multer({
  storage: multerS3({
     s3,
     bucket: 'wavesense',
     metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
     },
     key: function (req, file, cb) {
        cb(null, "song" + Date.now().toString() + ".mp3");
     }
  })
})

router.get('/', async (req, res) => {

  const songs = await Song.find();
  return res.json(songs);

});

router.get('/:title', async (req, res) => {
  const songs = await Song.find();

  const song = songs.find( (song) => {
    return song.title.toLowerCase().includes(req.params.title);
  }) 

  if(song){
    return res.json(song);
  } else {
    return res.json({message: "no song with that title"})
  }

});

router.post('/', upload.single('audio-upload'), async (req, res) => {
  const urlBeginning = req.file.location.substr(0, 8);
  const urlEnding = req.file.location.substr(18, (req.file.location.length -1))       // url is being doubled somewhere in multer for some reason
  const goodUrl = urlBeginning + urlEnding;
  console.log(req.body.title);

  const newSong = new Song({
    title: req.body.title,
    artist: req.body.artist,
    url: goodUrl
  });

  let song = await newSong.save();

  console.log(song)

  return res.json(song)

})


module.exports = router;
