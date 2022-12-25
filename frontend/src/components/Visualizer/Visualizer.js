import styles from "./Visualizer.module.css";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PositionalAudio, Plane, RoundedBox } from "@react-three/drei";
import Display from "./Display";
import TimeDisplay from "./TimeDisplay";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeLow } from '@fortawesome/free-solid-svg-icons';
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

const Visualizer = ({ songUrl }) => {
  const hiddenFileInput = useRef();
  const hiddenAudio = useRef();
  const containerRef = useRef();
  const audio = useRef();

  const [url, setURL] = useState();
  const [playTime, setPlayTime] = useState(0);
  
  useEffect(() => {
    if (url && audio.current) {
      stop();
      audio.current.url = url;
      audio.current.offset = 0;
      hiddenAudio.current.src = url;
    }
    
    const timer = setTimeout(() => { // needs something async to wait for new audio to load? AudioContext.statechage? canplaythrough event listener?
      if( audio.current ) {
        play();
      }
      console.log("url timer")
    }, 3000);

    const interval = setInterval(() => {
      if (hiddenAudio.current) setPlayTime(hiddenAudio.current.currentTime);
    }, 1000)
    
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
    console.log(audio.current.context.currentTime)
    audio.current.stop();
    audio.current.offset = value;
    hiddenAudio.current.currentTime = value;
    audio.current.play();
    hiddenAudio.current.play();
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
      <button id={styles.fileUploadButton} onClick={handleFileSubmitClick}>play local file</button>
      { hiddenAudio.current &&
      <>
        <div>
            <input type="range" value={playTime} min={0} max={ hiddenAudio.current.duration ? Number(hiddenAudio.current.duration) : '' } onChange={e => setTime(e.target.value)}/>
          <div>
            <TimeDisplay song={hiddenAudio.current} />
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


    <audio ref={hiddenAudio} src={url} muted={true} />
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
