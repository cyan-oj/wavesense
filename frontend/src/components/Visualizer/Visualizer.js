import styles from "./Visualizer.module.css";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PositionalAudio } from "@react-three/drei";
import Display from "./Display";
import TimeDisplay from "./TimeDisplay";

const Visualizer = ({ songUrl }) => {
  const hiddenFileInput = useRef();
  const hiddenAudio = useRef();
  const containerRef = useRef();
  const audio = useRef();

  const [url, setURL] = useState();
  const [playTime, setPlayTime] = useState(0);
  
  useEffect(() => { // controls audio switching
    console.log("viz useeffect");
    if (url && audio.current) {
      stop();
      audio.current.url = url;
      hiddenAudio.current.src = url;
      console.log(audio.current.url);
    }
    
    const timer = setTimeout(() => { // needs something async to wait for new audio to load? AudioContext.statechage? canplaythrough event listener?
      if( audio.current ) {
        play();
      }
      console.log("url timer")
    }, 3000);

    const interval = setInterval(() => {
      setPlayTime(hiddenAudio.current.currentTime);
    }, 500)
    
    return () => {
      clearTimeout(timer)
      clearInterval(interval)
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
      pause();
    } else {
      play();
    }
  };

  const volUp = () => {
    const currentVolume = audio.current.getVolume()
    audio.current.setVolume( currentVolume + 1 ) 
  }
  
  const volDown = () => {
    const currentVolume = audio.current.getVolume()
    audio.current.setVolume( currentVolume - 1 ) 
  }

  const setFile = () => {
    const file = hiddenFileInput.current.files[0]
    setURL(URL.createObjectURL(file));
  };

  const setTime = (value) => {
    console.log("scrubber value", value)
  }

  const play = () => {
    audio.current.play();
    hiddenAudio.current.play();
  }

  const pause = () => {
    audio.current.pause();
    hiddenAudio.current.pause();
  }

  const stop = () => {
    audio.current.stop();
  }

  return (
  <div id={styles.visualizerContainer}>

    <div id={styles.controls}>
      <button id={styles.fileUploadButton} onClick={handleFileSubmitClick}>set local file</button>
      <button id={styles.fileUploadButton} onClick={playPause}>||</button>
      <button id={styles.fileUploadButton} onClick={volUp}>+</button>
      <button id={styles.fileUploadButton} onClick={volDown}>-</button>
    </div>

    { hiddenAudio.current &&
      <div>
        <input type="range" value={playTime} min={0} max={Number(hiddenAudio.current.duration)} onChange={e => setTime(e.target.value)}/>
        <div>
          <TimeDisplay song={hiddenAudio.current} />
        </div>
      </div>
    }
    <audio ref={hiddenAudio} src={url} muted={true} />

    <input type="file" ref={hiddenFileInput} id="fileupload" accept="audio/*" onChange={ setFile } style={{ display: "none" }} />

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
