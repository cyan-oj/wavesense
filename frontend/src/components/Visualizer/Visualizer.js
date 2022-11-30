import styles from './Visualizer.module.css';
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PositionalAudio } from '@react-three/drei'
import GridViz from './gridViz';
import Analyzer from './Analyzer';

const Visualizer = ( { songUrl } ) => {
    
    const hiddenFileInput = useRef()
    const containerRef = useRef()
    const audio = useRef();

    const [url, setURL] = useState();

    useEffect(() => {
        console.log("viz useeffect")
        if (url && audio.current) {
            audio.current.stop();
            audio.current.url = url;
            console.log(audio.current.url)
        }
    }, [url])

    const handleFileSubmitClick = () => {
        hiddenFileInput.current.click();
    }

    const playPause = () => {
        if (audio.current.isPlaying){
            audio.current.pause();
        } else {
            audio.current.play();
        }
        
    }

    const playFile = (file) => {
        console.log("playableFile?", file)
        setURL(URL.createObjectURL(file));
    }

    return (
        <div id={styles.visualizerContainer}>
            <div id={styles.controls}>
                <button id={styles.fileUploadButton} onClick={handleFileSubmitClick}>Play Local File</button>
                <button id={styles.fileUploadButton} onClick={playPause}>P</button>
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
                    <Suspense fallback={null}>
                        {url &&
                            <PositionalAudio autoplay ref={ audio } url={ url } /> 
                        }
                        <Analyzer audio={ audio } />
                    </Suspense>
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