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
    DoubleSide,
    EdgesGeometry,
    LineSegments,
    LineDashedMaterial,
    HemisphereLight
} from 'three';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';

const Visualizer = ( { songUrl } ) => {
    const hiddenFileInput = useRef(null)

    const url = songUrl
    console.log("incoming songUrl useState", songUrl)
    const containerRef = useRef(null) // grabs container so visualizer can be made to fit parent visualizer element 
    const audioRef = useRef(null) // will be used to hold reference to audio element
    const canvasRef = useRef(null) // holds visualiser canvas 


    const fourierSize = 32; // should eventually be passed in as prop? used to set detail level of audio data
    const [dataArray, setDataArray] = useState(new Uint8Array(fourierSize/2)); // used to store raw audio data
    const [isPlaying, setIsPlaying] = useState(false)

    // predeclaring variables that multiple functions need to e
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
    let groundPlane;
    
    useEffect(() => { // new dependency for play/pause?
        console.log("useEffect rendering: songurl", songUrl);
        setIsPlaying(true);
        console.log("useEffect isPlaying", isPlaying);
        const container = containerRef.current // grab DOM container to hold 3D canvas
        // set up Three.js scene, camera and renderer element
        scene = new Scene();
        camera = new PerspectiveCamera( 75, container.offsetWidth / container.offsetHeight, 0.1, 1000 );
        renderer = new WebGLRenderer({ canvas: canvasRef.current, antialias: true });
        renderer.shadowMapEnabled = true
        renderer.setSize( container.offsetWidth, container.offsetHeight );
        container.appendChild( renderer.domElement );

        // const loader = new ColladaLoader();
        // loader.load("../../scenes/cubeTrial.dae", function (result) {
        //     scene.add(result.scene);
        // });
        const examplegeometry = new BoxGeometry( 2, 2, 2 );
        const edges = new EdgesGeometry( examplegeometry );


        // add CU
        const geometry = new BoxGeometry( 1, 1, 1 );
        // const material = new MeshBasicMaterial({ color: 0x00ff00 });
        const material = new MeshLambertMaterial({ color: 0x65b2ab });
        const cubeMaterial = new MeshLambertMaterial({ color: 0x65b2ab, transparent: true, opacity: .8 });
        const wireMaterial = new MeshBasicMaterial({ color: 0x65b2ab, wireframe: true });

        for (let i = 0; i < fourierSize/2; i++) {
            const bar = new Mesh( geometry, material );
            bar.position.z = -8
            bar.position.x = 1.5*i - fourierSize/2.8
            bar.rotation.x = .4
            bar.scale.x = .2
            bar.scale.z = .2
            bar.name = `bar${i}`
            scene.add( bar )
        }

        for (let i = 0; i < 2; i++) {
            const box = new Mesh( geometry, wireMaterial );
            box.position.z = 3
            box.position.x = 2*i - 1
            box.rotation.x = i - .5
            box.scale.x = 1
            box.scale.z = 1
            box.name = `box${i}`
            scene.add( box )
        }

        const cubeGeo = new BoxGeometry(16, 16, 16)
        cube = new Mesh( cubeGeo, cubeMaterial );
        cube.scale.set(.025, .025, .025)
        cube.position.z = 3
        cube.rotation.y = Math.PI/3.4
        cube.rotation.z = Math.PI/2.8
        cube.rotation.x = Math.PI/3.1
        cube.castShadow = true
        cube.name = "cube"
        scene.add( cube );


        // add plane
        const planeGeo = new PlaneGeometry(1, 1, 1);
        const planeMat = new MeshLambertMaterial({ color: 0x2825f5 });
        plane = new Mesh( planeGeo, planeMat );
        plane.position.z = -400
        plane.scale.set( 2000, 2000, 2000 )
        plane.name = "backdrop"
        scene.add( plane );

        const groundGeo = new PlaneGeometry(16, 16, 16);
        const groundMat = new MeshLambertMaterial({ color: 0xb826f6, transparent: true, opacity: 0.5  });
        groundPlane = new Mesh( groundGeo, groundMat );
        groundPlane.rotation.x = 1.6
        groundPlane.position.z = -10
        groundPlane.material.side = DoubleSide;
        groundPlane.scale.set( 300, 300, 300 )
        groundPlane.name = "ground"
        scene.add( groundPlane );

        const light = new HemisphereLight(0x000000, 0xed289b, 1)
        scene.add(light)
        // add spotlight
        spotlight = new SpotLight(0xffffff);
        spotlight.position.set (0, 30, 50);
        scene.add(spotlight);
        // make camera not inside cub
        camera.position.z = 4;  
        //display scene on 3D canvas
        renderer.render( scene, camera ); 
        console.log("scene", scene)
        if(url) {
            console.log("play!")
            play();
        }

        return () => {
            console.log("cleanup")
            setIsPlaying(false);
            console.log("cleanup isPlaying?", isPlaying);
        }
    }, [songUrl]);

    useEffect(() => {
        console.log(url)
    }, [songUrl])

    const average = array => array.reduce((a, b) => a + b)/array.length



    const play = (file) => {
        const audio = audioRef.current //grab audio DOM element
        //audio.src = url // grab source url from props
         audio.src = URL.createObjectURL(file) // make passed-in file into dataURL
        
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
            //console.log(data
            // console.log("frame")
            const xAvg = average(dataArray.slice( 0, 5 ))/8000
            const yAvg = average(dataArray.slice( 6, 10 ))/8000
            const zAvg = average(dataArray.slice( 11, 15))/4000
            const totalAvg = average(dataArray)/5000
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
                        child.scale.set(scaleX, scaleY, scaleZ)
                        break;
                    default:
                        break;
                }
            })
            ///////
            // cube.rotation.x += (scaleX) 
            // cube.rotation.y += (scaleY) 
            // cube.rotation.z += (scaleZ)
            // cube.scale.set(scaleX, scaleY, scaleZ)

            requestAnimationFrame( animate );
            renderer.render( scene, camera );
        }
        animate();
    }

    const handleFileSubmitClick = () => {
        hiddenFileInput.current.click();
    }

    const stopPlaying = e => {
        console.log("STOP");
        setIsPlaying(false);
        console.log("stopPlaying isPlaying?", isPlaying)
    }

    return (
        <>
            <h1 style={{ color: "white"}}>{isPlaying ? "PLAYING" : "NOT PLAYING"}</h1>
            <div id={styles.visualizerContainer}>
                <div id={styles.controls}>
                    <audio ref={ audioRef } id="test-audio" controls
                        onPause={ stopPlaying }
                        onEnded={ stopPlaying }
                    ></audio>
                    <button id={styles.fileUploadButton} onClick={handleFileSubmitClick}>Play Local File</button>
                    <input 
                        type="file"
                        ref={hiddenFileInput}
                        id="fileupload"
                        accept="audio/*"
                        onChange={(e) => play(e.currentTarget.files[0])}
                        style={ {display: 'none'}}
                    />
                </div>
                <div ref={ containerRef} id={ styles.container3D }>
                    <canvas ref={ canvasRef }></canvas>
                </div>
            </div>
        </>
    );
};

export default Visualizer;