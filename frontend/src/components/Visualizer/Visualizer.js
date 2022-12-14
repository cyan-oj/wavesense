import styles from "./Visualizer.module.css";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PositionalAudio } from "@react-three/drei";
import Display from "./Display";

const Visualizer = ({ songUrl }) => {
  const hiddenFileInput = useRef();
  const containerRef = useRef();
  const audio = useRef();

  const [url, setURL] = useState();

  useEffect(() => {
    console.log("viz useeffect");
    if (url && audio.current) {
      audio.current.stop();
      audio.current.url = url;
      console.log(audio.current.url);
    }
    
    const timer = setTimeout(() => { // needs something async to wait for new audio to load?
      if( audio.current ) {
        audio.current.play();
      }
      console.log("url timer")
    }, 3000);
    
    return () => {
      clearTimeout(timer)
    }
  }, [url]);
  
  useEffect(() => {
    if(songUrl) setURL(songUrl);
  }, [songUrl])

  const handleFileSubmitClick = () => {
    hiddenFileInput.current.click();
  };

  const playPause = () => {
  if (audio.current.isPlaying) {
    audio.current.pause();
  } else {
    audio.current.play();
  }

  console.log("duration", audio.current.context.getOutputTimestamp())
  };

  const raiseGain = () => {
    const currentVolume = audio.current.getVolume()
    audio.current.setVolume( currentVolume + 1 ) 
  }
  
  const lowerGain = () => {
    const currentVolume = audio.current.getVolume()
    audio.current.setVolume( currentVolume - 1 ) 
  }

  const setFile = () => {
    const file = hiddenFileInput.current.files[0]
    setURL(URL.createObjectURL(file));
  };

  return (
  <div id={styles.visualizerContainer}>
    <div id={styles.controls}>
    <button id={styles.fileUploadButton} onClick={handleFileSubmitClick}>set local file</button>
    <button id={styles.fileUploadButton} onClick={playPause}>||</button>
    <button id={styles.fileUploadButton} onClick={raiseGain}>+</button>
    <button id={styles.fileUploadButton} onClick={lowerGain}>-</button>
    <input
      type="file"
      ref={hiddenFileInput}
      id="fileupload"
      accept="audio/*"
      onChange={ setFile }
      style={{ display: "none" }}
    />
    </div>
    <div ref={containerRef} id={styles.container3D}>
    <Canvas camera={{ position: [0, 0, 5], far: 50 }}>
      <Suspense fallback={ null }>
        { url && 
          <>
          <PositionalAudio ref={audio} url={url} />
          <Display audio={ audio } />
          </>
        }
      </Suspense>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <OrbitControls />
    </Canvas>
    </div>
  </div>
  );
};

export default Visualizer;
