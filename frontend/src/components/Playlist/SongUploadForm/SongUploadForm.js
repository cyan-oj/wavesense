import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import jwtFetch from '../../../store/jwt';
import styles from './PlaylistSongIndex.module.css'
import { getPlaylists, fetchPlaylists } from '../../../store/playlists';
import { useEffect } from 'react';


const SongUploadForm = (props) => {
    const close = props.close;
    const reload = props.reload;
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [selectedPlaylistId, setSelectedPlaylistId] = useState('')
    const [file, setFile] = useState(null);
    // const [dataUrl, setDataUrl] = useState('');
    const dispatch = useDispatch()

    const currentUser = useSelector(state => state.session.user);
    const allPlaylists = useSelector(getPlaylists)

    const listedPlaylists = allPlaylists.filter((playlist) => {
        if (currentUser._id == playlist.creator._id) {
            
            return playlist !== undefined
        }
    })

    // useEffect(() => {
    //     dispatch(fetchPlaylists())
    // }, [dispatch])
    
    console.log(allPlaylists)
    console.log(listedPlaylists)

    // const newSong = {
    //     title: title,
    //     artist: artist,
    //     url: dataUrl
    // }


    // This is where we can send to Mongo
    // useEffect( () => { 
    //     if( title && artist && dataUrl ){
    //         console.log(dataUrl);
    //     }
    // }, [dataUrl]);

    const handleChange = (e)=>{
        e.preventDefault();
        setFile(e.currentTarget.files[0]);
    }

    const handleSubmit = async (e)=>{
        close(false); // This closes the modal after submit

        if(!currentUser){
            console.log("You're not logged in");
            return;
        }
        e.preventDefault();
        // toDataURL(file);
        // console.log(newSong);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('playlistId', selectedPlaylistId);
        formData.append('audio-upload', file);

        console.log(formData);

        const res = await jwtFetch('/api/songs', {
            method: 'POST',
            body: formData
        });

        const res2 = await res.json();
        reload( p => p+1 ); // This changes the playlist component state to make it rerender
    }
    
    return (
        <>
            <h1 id={styles.header}>Add a song</h1>
            <form onSubmit={handleSubmit} id={styles.addSongForm}>
                <br />
                <input className={styles.inputFields} placeholder='Title' value={title} onChange={(e)=>setTitle(e.target.value)}/>
                <br />
                <input className={styles.inputFields} placeholder='Artist' value={artist} onChange={(e)=>setArtist(e.target.value)}/>
                <br />
                <select className={styles.inputFields}>Select Playlist
                    {listedPlaylists.map((playlist, i) => (
                        <option onClick={(e) => setSelectedPlaylistId(playlist._id)}key={playlist._id}>{i + 1}. {playlist.title}</option>
                    ))}
                </select>
                <input type='file' onChange={handleChange}/>
                <br></br>
                <button type='submit' id={styles.submitSongButton} >Add Song (Please Be Patient)</button>
            </form>
        </>
    );
};

export default SongUploadForm;


// import styles from '../../Visualizer/Visualizer.module.css';
// import React, { useEffect, useRef, useState } from "react";
// import { 
//     Scene, 
//     PerspectiveCamera, 
//     WebGLRenderer, 
//     BoxGeometry, 
//     MeshBasicMaterial, 
//     Mesh 
// } from 'three';

// const Visualizer = () => {

//     const [uploadFile, setUploadFile] = useState(null);
//     const [dataURL, setDataURL] = useState('');

//     const audioRef = useRef(null) // will be used to hold reference to audio element
//     const fourierSize = 32; // should eventually be passed in as prop? used to set detail level of audio data
//     const [dataArray, setDataArray] = useState(new Uint8Array(fourierSize/2)); // used to store raw audio data

//     // predeclaring variables that multiple functions
//     let audioSource;
//     let analyser;
//     let renderer;
//     let scene;
//     let camera;
//     let cube;
//     let scaleX;
//     let scaleY;
//     let scaleZ;

//     useEffect(() => {
//         const container = document.getElementById("3Dcontainer")
//         scene = new Scene();
//         camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//         renderer = new WebGLRenderer();
//         renderer.setSize( window.innerWidth, window.innerHeight );
//         container.appendChild( renderer.domElement );
        
//         const geometry = new BoxGeometry( 1, 1, 1 );
//         const material = new MeshBasicMaterial({ color: 0x00ff00 });
//         cube = new Mesh( geometry, material );
//         scene.add( cube );
//         camera.position.z = 5;     
//     }, []);
    
//     const play = (file) => {
//         setUploadFile(file);

//         // console.log("files", file)

//         const audio = audioRef.current
//         audio.src = URL.createObjectURL(file)
//         audio.load(); // load audio from file input element
//         audio.play(); // play audio

//         const audioContext = new AudioContext();
//         audioSource = audioContext.createMediaElementSource(audio);
//         analyser = audioContext.createAnalyser();
//         audioSource.connect(analyser);
//         analyser.connect(audioContext.destination);
//         analyser.fftSize = fourierSize;
//         // console.log(audioSource);
        
//         const bufferLength = analyser.frequencyBinCount;
//         // console.log("bufferLength", bufferLength)
//         // console.log("dataArray", dataArray)
        
//         const animate = () => {
//             // console.log("frame")
//             // console.log("dataArray", dataArray)
//             // console.log(analyser)
            
//             analyser.getByteFrequencyData(dataArray);
            
//             scaleX = dataArray[0]/50; 
//             scaleY = dataArray[8]/50; 
//             scaleZ = dataArray[12]/20; 
//             // console.log("X", scaleX)
//             // console.log("Y", scaleY)
//             // console.log("Z", scaleZ)
            
//             cube.rotation.x += 0.01;
//             cube.rotation.y += 0.01;
//             cube.scale.set(scaleX, scaleY, scaleZ)
            
//             requestAnimationFrame( animate );
//             renderer.render( scene, camera );
//         }
//         animate();
//     }

//     const handleClick = async (e) => {
//         // console.log(uploadFile)
//         e.preventDefault();
//         toDataURL(uploadFile)

//         // console.log(dataURL);
//     }

    // const toDataURL = file => {
    //     let URL;
    //     // console.log("file", file)
    //     const reader = new FileReader();
    //     reader.onload = event => {
    //         URL = event.target.result
    //         setDataURL(URL);
    //         console.log(URL)
    //     };
    //     reader.readAsDataURL(file)

    //     // return dataURL;
    // }

//     return (
//         <>
//             <div id={styles.visualizerContainer} >
//                 <audio ref={ audioRef } id="test-audio" controls></audio>
//                 <input 
//                     type="file" 
//                     id="fileupload" 
//                     accept="audio/*" 
//                     onChange={ e => play(e.currentTarget.files[0]) }
//                 />
//                 <button onClick={handleClick}>Upload?</button>
//                 <div id="3Dcontainer"></div>
//             </div>
//         </>
//     );
// };

// export default Visualizer;



// Old CORS Configuration
// [
//     {
//         "AllowedHeaders": [
//             "Authorization"
//         ],
//         "AllowedMethods": [
//             "GET",
//             "HEAD"
//         ],
//         "AllowedOrigins": [
//             "*"
//         ],
//         "ExposeHeaders": [
//             "Access-Control-Allow-Origin"
//         ]
//     }
// ]