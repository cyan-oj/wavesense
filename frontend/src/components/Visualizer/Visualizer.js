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
    const containerRef = useRef(null) // grabs container so visualizer can be made to fit parent visualizer element 
    const audioRef = useRef(null) // will be used to hold reference to audio element
    const fourierSize = 32; // should eventually be passed in as prop? used to set detail level of audio data
    const [dataArray, setDataArray] = useState(new Uint8Array(fourierSize/2)); // used to store raw audio data

    // predeclaring variables that multiple functions need to use
    // todo: properly react-ify these
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
        const container = containerRef.current // grab DOM container to hold 3D canvas
        // set up Three.js scene, camera and renderer element
        scene = new Scene();
        camera = new PerspectiveCamera( 75, container.offsetWidth / container.offsetHeight, 0.1, 1000 );
        renderer = new WebGLRenderer();
        renderer.setSize( container.offsetWidth, container.offsetHeight );
        container.appendChild( renderer.domElement );
        // add CUBE
        const geometry = new BoxGeometry( 1, 1, 1 );
        const material = new MeshBasicMaterial({ color: 0x00ff00 });
        cube = new Mesh( geometry, material );
        scene.add( cube );
        // make camera not inside cube
        camera.position.z = 5;   
        //display scene on 3D canvas
        renderer.render( scene, camera );  
    }, []);
    
    const play = (file) => {
    
        const audio = audioRef.current //grab audio DOM element
        audio.src = URL.createObjectURL(file) // make passed-in file into dataURL
        audio.load(); // load audio from src
        audio.play(); // play audio

        const audioContext = new AudioContext(); // create audio context that can access audio API methods
        // create analyser that listens to the output from the audio element
        audioSource = audioContext.createMediaElementSource(audio);
        analyser = audioContext.createAnalyser();
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = fourierSize;
        
        const animate = () => { // re-renders scene with modifiers from analyser
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
            <div id={styles.visualizerContainer}>
                <div id={styles.controls}>
                    <audio ref={ audioRef } id="test-audio" controls></audio>
                    <input 
                        type="file" 
                        id="fileupload" 
                        accept="audio/*" 
                        onChange={ e => play(e.currentTarget.files[0]) }
                    />
                </div>
                <div ref={ containerRef} id={styles.container3D}></div>
            </div>
    );
};

export default Visualizer;