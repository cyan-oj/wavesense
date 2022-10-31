# Background

Do you wish there was a way to vibe with audio visually and audibly rather than only listening to it? [WaveSense](https://wavesense.herokuapp.com/ "WaveSense") is an audio visualizer application that enables users to select songs or upload local audio files, then feeds the selected audio into a visual display reflective of the audio waves. 

# Functionality & MVP
- ### New User and User Login
    New Users can sign up for an account by clicking the 'Sign Up' button in the Navigation Bar. If users already have an account, they can use login.
    ![Signup](./signup.png)
    ![Login](./login.png)

- ### Music Player and Music Visualizer
    Users can select a song from the song list on the left or upload a local audio file to start playing. The audio will feed into the visualizer and display movements.

    ![PlayerVisualizer](./playervisualizer.png)

- ### Songs
    Users can upload audio files and the song title will be displayed on the song list. 

- ### Playlists
    If a user is signed in, they can create playlists, update their own playlists, and delete a playlist. 


# Future Features
- Likes/favorites for top songs and playlists
- Search bar to find songs by name
- Interactive/game element that uses the sound data driving the visualizer

# Technologies & Technical Challenges

WaveSense is built on the MERN stack  (MongoDB, Express, React, and Node)

The visualizer is built using Canvas.

## Backend: MongoDB/Express

MongoDB, a noSQL database, is used as the database to hold User, Song, and Playlist document data. Express.js framework is used in the application's backend models, routes, and validations.

### Models:
Users: stores authentication information for the user and allows them to save their preferences for later use or use on other devices.

Songs: each song object has a title, url, and artist. The url is connected to where it is stored in AWS S3.

Playlists: playlists each have a creator that references the User model, a title, a description, and an array of songs.

## Frontend: React/Node.js

Visualizer: Canvas provides the visual context for the visualizer, using data provided by the audio file.

UI: we don't want to interupt the listening experience, so all user-interaction takes place on the same page. The React.js library is used to build components in the frontend. It allows the user to sign in and out and manipulate their playlists in modals, without leaving the main page. Once they're set up, the user is able to get the UI out of the way and enjoy the visualizer.


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
The Main page renders two child components, Playlist and Visualizer, so that the same props of songUrl and setSongUrl can be passed to both siblings.
```javascript
//frontend/src/components/Playlist/Playlist.js
const handleClick = (e) => {
    e.preventDefault()
    setSelectedSong(e.target.id)
    setSongUrl(e.target.value);
}
```
Song elements within the Playlist component have both an id and a value. The handleClick helper function uses the song id to display information within the playlist, while passing the value to the Visualizer component. 
```javascript
//frontend/src/components/Visualizer/Viszualizer.js
const play = (file) => {
    const audio = audioRef.current
    audio.src = url     
    audio.crossOrigin="anonymous"
    audio.load();
    audio.play();
```
The Visualizer component receives the selected song URL, then loads the audio file from AWS S3 for concurrent visualizer analysis and audio playback. 

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
Each playlist object has four key attributes: creator, title, description, and songs. The value of a playlist's creator is an unique identifier(object Id) referencing the User documents. The title and description attributes are used to add details to the playlist. The value of songs are an array of song objects that belong to the specific playlist.  

```javascript 
//backend/routes/api/playlists.js
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
```
The code above is the backend route to create a playlist. The router takes in a route, middleware(requireUser), and a callback function/route handler. If the request matches both the route('/') and the HTTP method(POST) it will hit the requireUser middleware then the route handler. The requireUser ensures there is a current user, otherwise it throws an error. The creator value is accessed from req.user which is provided by requireUser. The description, title, and songs values are accessed from the request body. The newly created playlist is saved then the creator value is a User object populated with the creator's Id and username keys and values, and finally the playlist is returned as a JSON reponse. 

## Kat
Once we have a source URL from AWS, we can set up our three.js renderer 

```javascript
// frontend/src/components/Visualizer/Viszualizer.js
// ...
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshLambertMaterial({ color: 0x65b2ab });
// ...

for (let i = 0; i < fourierSize/2; i++) {
    const bar = new THREE.Mesh( geometry, material );
    bar.position.z = -8
    bar.position.x = 1.5*i - fourierSize/2.8
    bar.rotation.x = .4
    bar.scale.x = .2
    bar.scale.z = .2
    bar.name = `bar${i}`
    scene.add( bar )
}
```
First we set up a basic geometry and materials. In this case a basic cube which will be the basis for most of the shapes on screen. This loop lets us generate a number of 3D bars that we can later manipulate.

first, a quick check for whether our audio source is a local upload or remote from AWS. Then, we set up the audio context and analyser to get some workable data from our audio file.

```javascript
// frontend/src/components/Visualizer/Viszualizer.js
const audio = audioRef.current 
if(!file){
    sceneSetup();
    audio.src = url 
    audio.crossOrigin="anonymous"
} else{
    sceneSetup();
    audio.src = URL.createObjectURL(file) 
}

audio.play();

const audioContext = new AudioContext();
const streamDestination = audioContext.createMediaStreamDestination();
audioSource = audioContext.createMediaElementSource(audio);
analyser = audioContext.createAnalyser();
audioSource.connect(streamDestination)
audioSource.connect(analyser);
analyser.connect(audioContext.destination);
analyser.fftSize = fourierSize;
```
Once we have the scene set up and our audio source, we're ready to animate. The analyser puts the audio data into Uint8 array that we can then read and split into parts. On each new frame render, the data from the array is used to modify the properties of the elements, including scale, rotation speed and light brightness.
```javascript
// frontend/src/components/Visualizer/Viszualizer.js
const animate = () => {
    if(!isPlaying) return;
    analyser.getByteFrequencyData(dataArray);
    const xAvg = average(dataArray.slice( 0, 5 ))/8000
    const yAvg = average(dataArray.slice( 6, 10 ))/8000
    const zAvg = average(dataArray.slice( 11, 15))/4000
    const totalAvg = average(dataArray)/100

    scaleX = xAvg;
    scaleY = yAvg; 
    scaleZ = zAvg; 

    scene.children.forEach(child => {
        switch(child.name){ 
            case "bar0": 
            case "bar15":
                child.scale.y = average([dataArray[15], dataArray[14]])/6 + .5
                break;
            case "bar1":
            case "bar14":
                child.scale.y = average( [dataArray[13], dataArray[12]])/7 + .5
                break;
            case "bar2":
            case "bar13":
                child.scale.y = average( [dataArray[11], dataArray[10]])/8 + .5
                break;
            case "bar3":
            case "bar12":
                child.scale.y = average( [dataArray[9], dataArray[8]])/9 + .5
                break;
            case "bar4": 
            case "bar11":
                child.scale.y = average([dataArray[7], dataArray[6]])/10 + .5
                break;
            case "bar5":
            case "bar10":
                child.scale.y = average( [dataArray[5], dataArray[4]])/10 + .5
                break;
            case "bar6":
            case "bar9":
                child.scale.y = average( [dataArray[3], dataArray[2]])/11 + .5
                break;
            case "bar7":
            case "bar8":
                child.scale.y = average( [dataArray[1], dataArray[0]])/12 + .5
                break;
            case "box0":
            case "box1":
                child.rotation.y += scaleY/4 
                child.rotation.x += scaleX/4 
                child.rotation.z += scaleZ/4
                child.scale.set(scaleX*40, scaleY*40, scaleZ*40)
                break;
            case "cube":
                child.rotation.x += (scaleX) 
                child.rotation.y += (scaleY) 
                child.rotation.z += (scaleZ)
                child.scale.set((scaleX*15 + .01), (scaleY*15 + .01), (scaleZ*15 + .01))
                break;
            default:
                break;
        }
    })
    yellowPoint.intensity = totalAvg;

    loop = requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
```
