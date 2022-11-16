import styles from './Visualizer.module.css';
import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'
import GridViz from './gridViz';

const Visualizer = ( { songUrl } ) => {
    
    let url = songUrl  
    const hiddenFileInput = useRef(null)
    const containerRef = useRef(null) // grabs container so visualizer can be made to fit parent visualizer element 
    const audioRef = useRef(null) // will be used to hold reference to audio element
    const audioContextRef = useRef(null)

    const fourierSize = 32; // should eventually be passed in as prop? used to set detail level of audio data
    const [dataArray, setDataArray] = useState(new Uint8Array(fourierSize/2)); // used to store raw audio data

    let isPlaying = true;

    let loop;
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
        // psychoticHelperFunction();
        // return cancelAnimationFrame( loop );
    }, [])
    
    useEffect(() => {
        audioContextRef.current = new AudioContext;
        const file = hiddenFileInput.current.files[0]
        // psychoticHelperFunction();
        // if( url && isPlaying ) {
        //     play();
        // } else if ( file ) {
        //     play( file )
        // }
        return () => {
            cancelAnimationFrame( loop );
            audioContextRef.current.close();
        }

    }, [url, isPlaying]);

    // const average = array => array.reduce((a, b) => a + b)/array.length

    const play = (file) => {       
        const audio = audioRef.current 
        const audioContext = audioContextRef.current

        if(!file){
            audio.src = url 
            audio.crossOrigin="anonymous"
        } else{
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
        
        return {     
            update: () => {
                analyser.getByteFrequencyData(dataArray);
                return dataArray;
            },
        }
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
                <Canvas>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <pointLight position={[-10, -10, -10]} />
                    <GridViz position={[-1.2, 0, 0]} analyser={analyser} dataArray={dataArray} />
                    <OrbitControls />
                </Canvas>
            </div>
        </div>
    );
};

export default Visualizer;