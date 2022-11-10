import styles from './Visualizer.module.css';
import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three'

const Visualizer = ( { songUrl } ) => {
    
    let url = songUrl  
    const hiddenFileInput = useRef(null)
    const containerRef = useRef(null) // grabs container so visualizer can be made to fit parent visualizer element 
    const audioRef = useRef(null) // will be used to hold reference to audio element

    const audioContextRef = useRef(null)

    const canvasRef = useRef(null) // holds visualiser canvas 

    const fourierSize = 32; // should eventually be passed in as prop? used to set detail level of audio data
    const [dataArray, setDataArray] = useState(new Uint8Array(fourierSize/2)); // used to store raw audio data
    let isPlaying = true;

    let loop;
    let listener;
    let audioSource;
    let analyser;
    let renderer;
    let scene;
    let camera;

    let scaleX;
    let scaleY;
    let scaleZ;
    
    let plane;
    let groundPlane;
    
    let spotlight;
    let yellowPoint;

    useEffect(() => {
        psychoticHelperFunction();
        return cancelAnimationFrame( loop );
    }, [])
    
    useEffect(() => {
        audioContextRef.current = new AudioContext;
        const file = hiddenFileInput.current.files[0]
        psychoticHelperFunction();
        if( url && isPlaying ) {
            play();
        } else if ( file ) {
            play( file )
        }
        return () => {
            cancelAnimationFrame( loop );
            audioContextRef.current.close();
        }
    }, [url, isPlaying]);
    
    const psychoticHelperFunction = () => {
        const container = containerRef.current 
        
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 75, container.offsetWidth / container.offsetHeight, 0.1, 1000 );
        camera.position.z = 4;  
        renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
        renderer.setSize( container.offsetWidth, container.offsetHeight );
        container.appendChild( renderer.domElement );

        listener = new THREE.AudioListener();
        camera.add( listener );

        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshLambertMaterial({ color: 0x65b2ab });
        const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x65b2ab, transparent: true, opacity: .8 });
        const wireMaterial = new THREE.MeshBasicMaterial({ color: 0x65b2ab, wireframe: true });

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

        for (let i = 0; i < 2; i++) {
            const box = new THREE.Mesh( geometry, wireMaterial );
            box.position.z = 3
            box.position.x = 2*i - 1
            box.rotation.x = i - .5
            box.scale.x = 1
            box.scale.z = 1
            box.name = `box${i}`
            scene.add( box )
        }

        const cubeGeo = new THREE.BoxGeometry(1, 1, 1)
        const cube = new THREE.Mesh( cubeGeo, cubeMaterial );
        cube.scale.set(.01, .01, .01)
        cube.position.z = 3
        cube.rotation.y = Math.PI/3.4
        cube.rotation.z = Math.PI/2.8
        cube.rotation.x = Math.PI/3.1
        cube.castShadow = true
        cube.name = "cube"
        scene.add( cube );

        const planeGeo = new THREE.PlaneGeometry(1, 1, 1);
        const planeMat = new THREE.MeshLambertMaterial({ color: 0x2825f5 });
        plane = new THREE.Mesh( planeGeo, planeMat );
        plane.position.z = -400
        plane.scale.set( 2000, 2000, 2000 )
        plane.name = "backdrop"
        scene.add( plane );

        const groundGeo = new THREE.PlaneGeometry(16, 16, 16);
        const groundMat = new THREE.MeshLambertMaterial({ color: 0xb826f6, transparent: true, opacity: 0.5  });
        groundPlane = new THREE.Mesh( groundGeo, groundMat );
        groundPlane.rotation.x = 1.6
        groundPlane.position.z = -10
        groundPlane.material.side = THREE.DoubleSide;
        groundPlane.scale.set( 300, 300, 300 )
        groundPlane.name = "ground"
        scene.add( groundPlane );

        yellowPoint = new THREE.PointLight( 0xfff352, 1, 400, 3 );
        yellowPoint.position.set(0, 5, -4)
        scene.add( yellowPoint )

        const light = new THREE.HemisphereLight(0x000000, 0xed289b, 1)
        scene.add(light)

        spotlight = new THREE.SpotLight(0xffffff);
        spotlight.position.set (0, 30, 50);
        scene.add(spotlight);

        renderer.render( scene, camera ); 
    }

    const average = array => array.reduce((a, b) => a + b)/array.length

    const play = (file) => {
        
        const audio = audioRef.current 
        const audioContext = audioContextRef.current

        if(!file){
            psychoticHelperFunction();
            audio.src = url 
            audio.crossOrigin="anonymous"
        } else{
            psychoticHelperFunction();
            audio.src = URL.createObjectURL(file) 
        }

        audio.play();

        const streamDestination = audioContext.createMediaStreamDestination();
        audioSource = audioContext.createMediaElementSource(audio);
        analyser = audioContext.createAnalyser();
        audioSource.connect(streamDestination)
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = fourierSize;
        
        const animate = () => {
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
        animate();
    }

    const handleFileSubmitClick = () => {
        hiddenFileInput.current.click();
    }

    const stopPlaying = e => {
        isPlaying = false;
    }

    const startPlaying = () => {
        isPlaying = true;
    }

    const playFile = (file) => {
        console.log("playableFile?", file)
        isPlaying = true;
        url = (null);
        console.log("isPlaying in playFile?", isPlaying);
        play(file);
    }

    return (
        <div id={styles.visualizerContainer}>
            <div id={styles.controls}>
                <audio ref={ audioRef } id="test-audio" controls
                    onPlay={ startPlaying }
                    onPause={ stopPlaying }
                    onEnded={ stopPlaying }
                ></audio>
                <button id={styles.fileUploadButton} onClick={handleFileSubmitClick}>Play Local File</button>
                <input 
                    type="file"
                    ref={hiddenFileInput}
                    id="fileupload"
                    accept="audio/*"
                    onChange={e => playFile(e.currentTarget.files[0]) }
                    style={ {display: 'none'}}
                />
            </div>
            <div ref={ containerRef} id={ styles.container3D }>
                <canvas ref={ canvasRef }></canvas>
            </div>
        </div>
    );
};

export default Visualizer;