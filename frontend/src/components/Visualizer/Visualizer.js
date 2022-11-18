import styles from './Visualizer.module.css';
import React, { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PositionalAudio } from '@react-three/drei'
import GridViz from './gridViz';
import PlaySound from './PlaySound';

const Visualizer = ( { songUrl } ) => {
    
    let url = songUrl  
    const hiddenFileInput = useRef(null)
    const containerRef = useRef(null) // grabs container so visualizer can 
    const audioRef = useRef(null)

    const [data, setData] = useState([1]);

    const isPlaying = true

    const play = (file) => {       

        // if(!file){
        //     audio.src = url 
        //     audio.crossOrigin="anonymous"
        // } else{
        //     audio.src = URL.createObjectURL(file) 
        // }

        // audio.play();

        // analyser.connect(audioContext.destination);
        // analyser.fftSize = fourierSize;
        
        // loop = requestAnimationFrame(() => {
        //     setData(analyser.getByteFrequencyData(dataArray))
        //     console.log("data", data)
        // })
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
        url = URL.createObjectURL(file);
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
                <Canvas camera={{ position: [0, 0, 5], far: 50 }}>
                    <PlaySound url={'/glimpse.mp3'} />
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <pointLight position={[-10, -10, -10]} />
                    {/* <GridViz position={[-1.2, 0, 0]} data={data} /> */}
                    <OrbitControls />
                </Canvas>
            </div>
        </div>
    );
};

export default Visualizer;