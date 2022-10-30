// Run this via "npm run seed" in the backend
require('dotenv').config()

const seeder = require('mongoose-seed');
const mongoose = require('mongoose');
const db = require("./config/keys").mongoURI;
// console.log(db);
console.log("Seeding the Database...");

const User = require('./models/User');
const Playlist = require('./models/Playlist')
const Song = require('./models/Song');
const bcrypt = require('bcryptjs/dist/bcrypt');

mongoose
  .connect(db, { useNewUrlParser: true })
  .catch(err => {
    console.log(err.stack);
    process.exit(1);
  })
  .then((res) => {
    console.log("connected to db in development environment");
  });

// User.deleteMany({}, function(err) {
//     console.log('User collection removed')
// });
// Song.deleteMany({}, function(err) {
//   console.log('Song collection removed')
// });
// Playlist.deleteMany({}, function(err) {
//   console.log('Playlist collection removed')
// });

// const hash = (password) => {
//   bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash(password, salt, function(err, hash) {
//     // returns hash
//     console.log(hash, "<<<<<<<<<");
//     return hash;
//     });
//   });
// }

// const demoUser = {
//     'username': 'Demo',
//     'email': 'demo1@user.io',
//     'hashedPassword': "$2a$10$mQt8m7cdDv8zQ/2q81YvS.pFHp5gSBOYNoQL1lEVnWQwlGmvAyCgG"
// };

// const brian = {
//     'username': 'brian',
//     'email': 'brian@gmail.com',
//     'password': 'password'
// };
// const kat = {
//     'username': 'kat',
//     'email': 'kat@gmail.com',
//     'password': 'password'
// };
// const will = {
//     'username': 'will',
//     'email': 'will@gmail.com',
//     'password': 'password'
// };
// const may = {
//     'username': 'may',
//     'email': 'may@gmail.com',
//     'password': 'password'
// };

// const usersData = [
//     new User(demoUser),
//     // new User(brian),
//     // new User(kat),
//     // new User(will),
//     // new User(may),
// ]

// User.insertMany(usersData);

const songs = [
  new Song({
    'title': 'Clair de Lune',
    'url': 'https://wavesense.s3.amazonaws.com/clairdelune.mp3',
    'artist': 'Debussy'
  }),
  new Song({
    'title': 'For Elise',
    'url': 'https://wavesense.s3.amazonaws.com/furelise.mp3',
    'artist': 'Beethoven'
  }),
  new Song({
    'title': 'Gymnopedie No. 1',
    'url': 'https://wavesense.s3.amazonaws.com/gymnopedie.mp3',
    'artist': 'Satie'
  })
]

Song.insertMany(songs);

const [a, b, c] = songs;
// const playlists = [
//   new Playlist({
//     'creator': 1,
//     'title': 'Playlist 1',
//     'description': '#1 Playlist',
//     'songs': [a, b]
//   }),

//   new Playlist({
//     'creator': 2,
//     'title': 'Playlist 2',
//     'description': '#2 Playlist',
//     'songs': [b, c]
//   }),
// ]

// Playlist.insertMany(playlists);



mongoose.connection.close();
