const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Song = mongoose.model('Song');
const Playlist = mongoose.model('Playlist');
const { requireUser } = require('../../config/passport');



//retrieve a single user's playlists - Postman tested; works
router.get('/user/:userId', async (req, res, next) => {
    // let user;
    // try {
    //     user = await User.findById(req.params.userId);
    // } catch(err) {
    //     const error = new Error('User not Found');
    //     error.statusCode = 404;
    //     error.errors = { message: "No user found with that id"};
    //     return next(error);
    // }
    try {
        const playlists = await Playlist.find({ creator: req.params.userId })
                                        .sort({ createdAt: -1 })
                                        .populate("creator", "_id, username");
        console.log('hello')
        playlist.filter
        return res.json(playlists);
    }
    catch(err) {
        return res.json([]);
    }
})

//retrieve individual playlists - Postman tested; works
router.get('/:id', async (req, res, next) => {
    try {
        const playlist = await Playlist.findById( req.params.id )
                                        .populate("creator", "id, username");
        res.json(playlist);
    }
    catch(err) {
        const error = new Error('Playlist not found');
        error.statusCode = 404;
        error.errors = { message: "No playlist found with that id" };
        return next(error);
    }
})

//create a playlist - Postman tested; works
router.post('/', requireUser, async (req, res, next) => {
    try {
        const newPlaylist = new Playlist({
            creator: req.user._id,
            description: req.body.description,
            title: req.body.title, 
            songs: req.body.songs
        });

        let playlist = await newPlaylist.save();
        playlist = await playlist.populate('creator', '_id, username');
        return res.json(playlist);
    }
    catch(err) {
        next(err);
    }
});


//update a playlist - Postman tested; works
router.patch('/:id', requireUser, async (req, res, next) => {
    try {
        // let playlist = await Playlist.findById(req.params.id)
        const playlist = await Playlist.findByIdAndUpdate(req.params.id,
            {
                description: req.body.description,
                title: req.body.title,
                songs: req.body.songs
            }
        );
        return res.json(playlist);
    }
    catch (err) {
        next(err);
    }
});

// delete a playlist - Postman tested; works
router.delete('/:id', requireUser, async (req, res, next) => {
    try {
        const playlist = await Playlist.findById(req.params.id)
        await playlist.remove();
        return res.json();
    }
    catch (err) {
        next(err);
    }
})


//retrieve all playlists - Postman tested; works
router.get('/', async (req, res) => {
    const playlists = await Playlist.find()
        .populate("creator", "_id, username")
        .sort({ createdAt: -1 });
    return res.json(playlists);

});


module.exports = router;