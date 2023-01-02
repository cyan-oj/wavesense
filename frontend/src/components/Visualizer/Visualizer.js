import styles from "./Visualizer.module.css";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PositionalAudio } from "@react-three/drei";
import Display from "./Display";
import TimeDisplay from "./TimeDisplay";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeLow } from '@fortawesome/free-solid-svg-icons';
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

const Visualizer = ({ songUrl }) => {
  const hiddenFileInput = useRef();
  const containerRef = useRef();
  const audio = useRef();
  
  const [url, setURL] = useState();

  const [playTime, setPlayTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  
  useEffect(() => {
    if (url && audio.current) {
      audio.current.stop();
      audio.current.url = url;
      audio.current.offset = 0;
      setStartTime(audio.current.context.currentTime);
      setPlayTime(audio.current.context.currentTime - startTime);
    }

    const interval = setInterval(() => {
      if (audio.current) {
        const currentDuration = audio.current.buffer.duration
        if (currentDuration != maxTime) {
          setMaxTime(currentDuration);
        }
        if (audio.current.isPlaying) setPlayTime(audio.current.context.currentTime - startTime);
      }
    }, 50)
    
    return () => {
      clearInterval(interval)
    }
  }, [url]);
  
  useEffect(() => {
    if(songUrl) setURL(songUrl);
  }, [songUrl])

  useEffect(() => {
    if (audio.current) audio.current.play();
  }, [maxTime])

  const handleFileSubmitClick = () => {
    hiddenFileInput.current.click();
  };

  const playPause = () => {
    if (audio.current.isPlaying) {
      audio.current.pause();
    } else {
      audio.current.play();
    }
  };

  const volUp = () => {
    const currentVolume = audio.current.getVolume()
    audio.current.setVolume( Math.abs(currentVolume + 1) ) 
    console.log(currentVolume)
  }
  
  const volDown = () => {
    const currentVolume = audio.current.getVolume()
    audio.current.setVolume( Math.abs(currentVolume - 1)) 
    console.log(currentVolume)
  }
  
  const setFile = () => {
    const file = hiddenFileInput.current.files[0]
    setURL(URL.createObjectURL(file));
  };

  const setTime = (value) => {
    audio.current.stop();
    audio.current.offset = value;
    setStartTime(audio.current.context.currentTime - value)
    setPlayTime(audio.current.context.currentTime - startTime + value)
    audio.current.play();
  }

  return (
  <div id={styles.visualizerContainer}>

    <div id={styles.controls}>
      <button id={styles.fileUploadButton} onClick={handleFileSubmitClick}>play local file</button>
        {audio.current &&
        <>
          <div>
            <div>
              <input id={styles.inputRange} type="range" value={ playTime } min={0} max={ audio.current.buffer.duration ?  audio.current.buffer.duration : '' } onChange={e => setTime(e.target.value)}/>
              <TimeDisplay song={ audio.current } startTime={startTime}/>
            </div>
          </div>
          <div id={styles.playbackControls}>
              <button id={styles.playbackControlButton} onClick={playPause}><FontAwesomeIcon icon={faPlay} size="sm" /><FontAwesomeIcon icon={faPause} size="sm" /></button>
              <button id={styles.playbackControlButton} onClick={volDown}><FontAwesomeIcon icon={faVolumeLow} size="sm" /></button>
              <button id={styles.playbackControlButton} onClick={volUp}><FontAwesomeIcon icon={faVolumeHigh} size="sm" /></button>
          </div>
        </>
        }
    </div>

    <input type="file" ref={hiddenFileInput} id="fileupload" accept="audio/*" onChange={ setFile } style={{ display: "none" }} />

    <div ref={containerRef} id={styles.container3D}>
      <Canvas camera={{ position: [0, -.06, 3.4], far: 100, fov: 70, rotation: [.28, 0, 0] }}>
        <Suspense fallback={ null }>
          { url && 
            <>
              <PositionalAudio ref={audio} url={url} />
              <Display audio={ audio } />
            </>
          }
        </Suspense>
      </Canvas>
    </div>
  </div>
  );
};

export default Visualizer;