import styles from './Visualizer.module.css';
import React, { useEffect, useRef, useState } from "react";
import { 
    Scene, 
    PerspectiveCamera, 
    WebGLRenderer, 
    BoxGeometry, 
    MeshBasicMaterial, 
    Mesh 
} from 'three';

const Visualizer = () => {

    const audioRef = useRef(null) // will be used to hold reference to audio element
    const fourierSize = 32; // should eventually be passed in as prop? used to set detail level of audio data
    const [dataArray, setDataArray] = useState(new Uint8Array(fourierSize/2)); // used to store raw audio data

    // predeclaring variables that multiple functions
    let audioSource;
    let analyser;
    let renderer;
    let scene;
    let camera;
    let cube;
    let scaleX;
    let scaleY;
    let scaleZ;

    useEffect(() => {
        const container = document.getElementById("3Dcontainer")
        scene = new Scene();
        camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        renderer = new WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );
        
        const geometry = new BoxGeometry( 1, 1, 1 );
        const material = new MeshBasicMaterial({ color: 0x00ff00 });
        cube = new Mesh( geometry, material );
        scene.add( cube );
        camera.position.z = 5;     
    }, []);
    
    const play = (file) => {
        console.log("files", file)

        const audio = audioRef.current
        audio.src = URL.createObjectURL(file)
        audio.load(); // load audio from file input element
        audio.play(); // play audio

        const audioContext = new AudioContext();
        audioSource = audioContext.createMediaElementSource(audio);
        analyser = audioContext.createAnalyser();
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = fourierSize;
        
        const bufferLength = analyser.frequencyBinCount;
        console.log("bufferLength", bufferLength)
        console.log("dataArray", dataArray)
        
        const animate = () => {
            console.log("frame")
            console.log("dataArray", dataArray)
            console.log(analyser)
            
            analyser.getByteFrequencyData(dataArray);
            
            scaleX = dataArray[0]/50; 
            scaleY = dataArray[8]/50; 
            scaleZ = dataArray[12]/20; 
            console.log("X", scaleX)
            console.log("Y", scaleY)
            console.log("Z", scaleZ)
            
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            cube.scale.set(scaleX, scaleY, scaleZ)
            
            requestAnimationFrame( animate );
            renderer.render( scene, camera );
        }
        animate();
    }

    return (
        <>
            <div id={styles.visualizerContainer} >
                <audio ref={ audioRef } id="test-audio" controls></audio>
                <input 
                    type="file" 
                    id="fileupload" 
                    accept="audio/*" 
                    onChange={ e => play(e.currentTarget.files[0]) }
                />
                <div id="3Dcontainer"></div>
            </div>
        </>
    );
};

export default Visualizer;