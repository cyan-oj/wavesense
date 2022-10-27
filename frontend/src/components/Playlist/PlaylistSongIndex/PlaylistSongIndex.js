import { useEffect, useState } from 'react';
import jwtFetch from '../../../store/jwt';
import styles from './PlaylistSongIndex.module.css'


const PlaylistSongIndex = () => {

    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [file, setFile] = useState(null);
    const [dataUrl, setDataUrl] = useState('');

    const newSong = {
        title: title,
        artist: artist,
        url: dataUrl
    }


    // This is where we can send to Mongo
    useEffect( () => { 
        if( title && artist && dataUrl ){
            console.log(dataUrl);
        }
    }, [dataUrl]);

    const handleChange = (e)=>{
        e.preventDefault();
        setFile(e.currentTarget.files[0]);
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        // toDataURL(file);
        // console.log(newSong);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('audio-upload', file);

        console.log(formData);

        const res = await jwtFetch('/api/songs', {
            method: 'POST',
            body: formData
        });

        const res2 = await res.json();
        console.log(res2);
    }

    // const toDataURL = async(convertFile) => {
    //     let URL;
    //     const reader = new FileReader();
    //     reader.onload = async event => {
    //         URL = event.target.result;
    //         setDataUrl(URL);
        

    //     };
    //     reader.readAsDataURL(convertFile)
    // }

    return (
        <>
            <h1>TEST</h1>
            <form onSubmit={handleSubmit}>
                <input placeholder='title' value={title} onChange={(e)=>setTitle(e.target.value)}/>
                <input placeholder='artist' value={artist} onChange={(e)=>setArtist(e.target.value)}/>
                <input type='file' onChange={handleChange}/>
                <br></br>
                <input type='submit' />
            </form>
        </>
    );
};

export default PlaylistSongIndex;


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