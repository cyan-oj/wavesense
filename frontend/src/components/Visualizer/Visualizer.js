import styles from "./Visualizer.module.css";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PositionalAudio } from "@react-three/drei";
import Display from "./Display";
import TimeDisplay from "./TimeDisplay";

const Visualizer = ({ songUrl }) => {
  const hiddenFileInput = useRef();
  const containerRef = useRef();
  const audio = useRef();
  
  const [url, setURL] = useState();
  const [playTime, setPlayTime] = useState(0);

  const [maxTime, setMaxTime] = useState(0);
  
  useEffect(() => {
    if (url && audio.current) {
      stop();
      audio.current.url = url;
      audio.current.offset = 0;
      console.log(audio.current)
    }


    const interval = setInterval(() => {
      if (audio.current) {
        const currentDuration = audio.current.buffer.duration
        if (currentDuration != maxTime) {
          setMaxTime(currentDuration);
        }
      }
    }, 200)
    
    return () => {
      clearInterval(interval)
    }
  }, [url]);
  
  useEffect(() => {
    if(songUrl) setURL(songUrl);
  }, [songUrl])

  useEffect(() => {
    if (audio.current) play();
  }, [maxTime])

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
    audio.current.stop();
    audio.current.offset = value;
    audio.current.play();
  }

  const play = () => {
    audio.current.play();
  }
  
  const pause = () => {
    audio.current.pause();
  }

  const stop = () => {
    audio.current.stop();
  }


  return (
  <div id={styles.visualizerContainer}>

    <div id={styles.controls}>
      <button id={styles.fileUploadButton} onClick={handleFileSubmitClick}>play local file</button>
      <>
        <div>
          <input type="range" value={ playTime } min={0} max={ maxTime } onChange={e => setTime(e.target.value)}/>
          {audio.current &&
          <div>
            <TimeDisplay song={audio.current} />
          </div>
          }
        </div>
        <div id={styles.playbackControls}>
          <button id={styles.playbackControlButton} onClick={playPause}>⏯</button>
          <button id={styles.playbackControlButton} onClick={volDown}>-</button>
          <button id={styles.playbackControlButton} onClick={volUp}>+</button>
        </div>
      </>
    </div>

    <input type="file" ref={hiddenFileInput} id="fileupload" accept="audio/*" onChange={ setFile } style={{ display: "none" }} />

    <div ref={containerRef} id={styles.container3D}>
      <Canvas camera={{ position: [0, -.06, 3.4], far: 100, fov: 70, rotation: [.28, 0, 0] }}>
        <Suspense fallback={ null }>
          { url && 
            <>
              <PositionalAudio ref={audio} url={url} />
              <Display audio={ audio } play={ play }/>
            </>
          }
        </Suspense>
      </Canvas>
    </div>
  </div>
  );
};

export default Visualizer;
