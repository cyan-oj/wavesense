const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Song = mongoose.model('Song');

const AWS = require('aws-sdk');
const multer = require('multer');
const multers3 = require('multer-s3')

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1'
});

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

router.post('/', async (req, res) => {
  console.log(req);

  const upload = multer({
    storage: multers3({
      s3: s3,
      bucket: 'wavesense',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname });
      },
      key: function(req,file,cb){
        cb(null, `song-${Date.now()}.mp3`);
      }
    })
  })

  const uploadSingle = upload.single(
    'audio-upload'
  );

  uploadSingle(req,res, async (err) => {
    if(err) return res.status(400).json({ success: false, message: err.message });
    // console.log(req.files);
  })

  // await Song.create({
  //   title: 'test',
  //   url: '',
  //   artist: 'test'
  // })

  res.status(200).json({data: req.file });

});


module.exports = router;
