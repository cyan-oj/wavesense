# wavesense

Wavesense is a music visualizer and playlist manager using AWS S3 and Three.js
[Link Here](https://wavesense.herokuapp.com/)

# Functionality & MVP

- Music Player
- Music visualiser for on-page audio
- search to find new songs to play
- Playlist functionality
- Likes/favorites for top songs and playlists
- User sign-in to save and manage playlists
- Host live to Heroku
- production README

# Bonus Features
- interactive/game element that uses the sound data driving the visualizer

# Technologies & Technical Challenges

WaveSense will be build on the MERN stack  (MongoDB, Express, React, and Node)

We will be leveraging the youtube api as out source of audio content. 

The visualizer will be built using Threejs.

## Backend: MongoDB/Express

User preferences and playlists will be stored in a noSQL database.

### Models:
Users: stores basic auth information for the user and allows them to save their preferences for later use or use on other devices

Playlists: playlists each belong to one user and consist of links to the audio source

## Frontend: React/Node.js

Visualizer: Threejs will provide the visual context for the visualizer, using data provided by the Web Audio api.

UI: we don't want to interupt the listening experience, so all user-interaction should take place on the same page. We will be using React to allow the user to sign in and out and manipulate their palylists without leaving the playlist page. Once they're set up, the user should be able to get the UI out of the way and just enjoy the visualiser.

Daily Task Breakdowns

## Day 1
- User auth start **-May**
- Audio Library Familiarization/skeleton **-Kat**
- Youtube API **-Brian**
- Frontend Skeleton **-Will**

## Day 2
- Finish auth & set up playlists **-May**
- Build basic audio visualizer, test that audio given to the app can be used by basic visualizer element
- ablity to fetch single video from youtube and play in page
- Ensure backend information displays to frontend for styling

## Day 3
- Finalize user & playlist models
- Get youtube audio talking to visualizer element **-Brian & Kat**
- Style Style Style - Will

## Day 4
- Flex day. pair up onto any problems that are proving to be walls
- Host live

## Day 5
- UI polish
- Production Readme
- if hosting didn't work, figure out why and get it going


# Code Snippets
## Brian

```javascript 
//frontend/src/components/MainPage/MainPage.js
function MainPage() {

  const[songUrl, setSongUrl] = useState(null);

    return (
      <>
        <div id={styles.mainPageVideosContainer}>
          <Playlist songUrl={songUrl} setSongUrl={setSongUrl} />
          <Visualizer songUrl={songUrl}/>

```

```javascript
//frontend/src/components/Playlist/Playlist.js
const handleClick = (e) => {
    e.preventDefault()
    setSelectedSong(e.target.id)
    // console.log('e.target', e.target)
    // console.log('selectedSong',selectedSong)
    setSongUrl(e.target.value);
}
```

```javascript
const play = (file) => {
    console.log("file", file);
    console.log("url in play", url);

    //const audio = new Audio(url);
    const audio = audioRef.current //grab audio DOM element
    audio.src = url // grab source url from props
    //audio.src = URL.createObjectURL(file) // make passed-in file into dataURL
    
    audio.crossOrigin="anonymous"
    audio.load();
    audio.play(); // play audio
```


## May
```javascript
//backend/models/Playlist.js
const playlistSchema = Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    }, 
    songs: {
        type: Array
    }
}, {
    timestamps: true
});
```

```javascript 
//backend/routes/api/playlists.js

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
```
