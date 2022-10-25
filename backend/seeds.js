// Run this via "npm run seed" in the backend
require('dotenv').config()

const seeder = require('mongoose-seed');
const mongoose = require('mongoose');
const db = require("./config/keys").mongoURI;
// console.log(db);
console.log("Seeding the Database...");

const User = require('./models/User');
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

User.deleteMany({}, function(err) { 
    console.log('User collection removed') 
});
Song.deleteMany({}, function(err) { 
  console.log('Song collection removed') 
});

const demoUser = {
    'username': 'Demo',
    'email': 'demo1@user.io',
    'hashedPassword': '$2y$10$6wAx2vEmBtBF8okhyJslYeA18tNuxpiRWnMtMUGh863mfNtNZZaAS'
};

const brian = {
    'username': 'brian',
    'email': 'brian@gmail.com',
    'password': 'password'
};
const kat = {
    'username': 'kat',
    'email': 'kat@gmail.com',
    'password': 'password'
};
const will = {
    'username': 'will',
    'email': 'will@gmail.com',
    'password': 'password'
};
const may = {
    'username': 'may',
    'email': 'may@gmail.com',
    'password': 'password'
};

const usersData = [
    new User(demoUser),
    // new User(brian),
    // new User(kat),
    // new User(will),
    // new User(may),
]

User.insertMany(usersData);

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

// mongoose.connection.close();
