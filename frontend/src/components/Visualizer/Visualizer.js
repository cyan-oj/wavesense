import styles from './Visualizer.module.css';
import React, { useEffect, useRef, useState } from "react";
import { 
    Scene, 
    PerspectiveCamera, 
    WebGLRenderer, 
    BoxGeometry, 
    MeshBasicMaterial, 
    MeshLambertMaterial,
    Mesh, 
    PlaneGeometry,
    SpotLight,
} from 'three';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';

const Visualizer = ( { songUrl } ) => {

    const url = songUrl
    console.log("incoming songUrl useState", songUrl)
    const containerRef = useRef(null) // grabs container so visualizer can be made to fit parent visualizer element 
    const audioRef = useRef(null) // will be used to hold reference to audio element
    const canvasRef = useRef(null) // holds visualiser canvas 


    const fourierSize = 32; // should eventually be passed in as prop? used to set detail level of audio data
    const [dataArray, setDataArray] = useState(new Uint8Array(fourierSize/2)); // used to store raw audio data
    const [isPlaying, setIsPlaying] = useState(false)

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
    let spotlight;
    let plane;

    useEffect(() => { // new dependency for play/pause?
        console.log("useEffect rendering: songurl", songUrl);
        setIsPlaying(true);
        console.log("useEffect isPlaying", isPlaying);
        const container = containerRef.current // grab DOM container to hold 3D canvas
        // set up Three.js scene, camera and renderer element
        scene = new Scene();
        camera = new PerspectiveCamera( 75, container.offsetWidth / container.offsetHeight, 0.1, 1000 );
        renderer = new WebGLRenderer({ canvas: canvasRef.current, antialias: true });
        renderer.setSize( container.offsetWidth, container.offsetHeight );
        container.appendChild( renderer.domElement );

        // const loader = new ColladaLoader();
        // loader.load("../../scenes/cubeTrial.dae", function (result) {
        //     scene.add(result.scene);
        // });

        // add CUBE
        const geometry = new BoxGeometry( 1, 1, 1 );
        // const material = new MeshBasicMaterial({ color: 0x00ff00 });
        const material = new MeshLambertMaterial({ color: 0xff2200 });
        cube = new Mesh( geometry, material );
        cube.rotation.y += 1
        cube.rotation.z += 1
        scene.add( cube );
        // add plane
        const planeGeo = new PlaneGeometry(50, 50, 50);
        const planeMat = new MeshBasicMaterial({ color: 0x0000ff });
        plane = new Mesh( planeGeo, planeMat );
        plane.position.z = -4
        scene.add(plane);
        // add spotlight
        spotlight = new SpotLight(0xffffff);
        spotlight.castShadow = true;
        spotlight.position.set (15, 30, 50);
        scene.add(spotlight);
        // make camera not inside cube
        camera.position.z = 5;  
        //display scene on 3D canvas
        renderer.render( scene, camera ); 
        if(url) {
            console.log("play!")
            play();
        }
    }, [songUrl]);

    const average = array => array.reduce((a, b) => a + b)/array.length

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
        
        const audioContext = new AudioContext(); // create audio context that can access audio API methods
        // create analyser that listens to the output from the audio element
        const streamDestination = audioContext.createMediaStreamDestination();
        audioSource = audioContext.createMediaElementSource(audio);
        analyser = audioContext.createAnalyser();
        audioSource.connect(streamDestination)
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = fourierSize;
        
        const animate = () => { // re-renders scene with modifiers from analyser
            console.log("isPlaying in animation loop?", isPlaying)
            if(!isPlaying) return;
            analyser.getByteFrequencyData(dataArray);
            //console.log(dataArray);
            // console.log("frame")
            const xAvg = average(dataArray.slice( 0, 5 ))/50
            const yAvg = average(dataArray.slice( 6, 10 ))/50
            const zAvg = average(dataArray.slice( 11, 15))/10
            
            scaleX = xAvg;
            scaleY = yAvg; 
            scaleZ = zAvg; 
            // console.log( "X", scaleX )
            // console.log( "Y", scaleY )
            // console.log( "Z", scaleZ )
            
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            cube.scale.set(scaleX, scaleY, scaleZ)

            requestAnimationFrame( animate );
            renderer.render( scene, camera );
        }
        animate();
    }

    const stopPlaying = e => {
        console.log("STOP");
        setIsPlaying(false);
        console.log("isPlaying?", isPlaying);
    }

    return (
            <div id={styles.visualizerContainer}>
                <div id={styles.controls}>
                    <audio ref={ audioRef } id="test-audio" controls
                        onPause={ stopPlaying }
                        onEnded={ stopPlaying }
                    ></audio>
                    <input 
                        type="file" 
                        id="fileupload" 
                        accept="audio/*" 
                        onChange={ e => play(e.currentTarget.files[0]) }
                    />
                    <button onClick={ e => setIsPlaying(false) }>STPO</button>
                </div>
                <div ref={ containerRef} id={ styles.container3D }>
                    <canvas ref={ canvasRef }></canvas>
                </div>
            </div>
    );
};

export default Visualizer;