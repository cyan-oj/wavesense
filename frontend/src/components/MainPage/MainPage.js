import Playlist from "../Playlist/Playlist";
import YouTubeBox from "../YouTubeBox/YouTubeBox";
import Visualizer from "../Visualizer/Visualizer";
import styles from './MainPage.module.css';
import VisualizerSettings from "../VisualizerSettings/VisualizerSettings";
import { useState } from "react";


function MainPage() {

  const[songUrl, setSongUrl] = useState(null);

    return (
      <>
        <div id={styles.mainPageVideosContainer}>
          <Playlist songUrl={songUrl} setSongUrl={setSongUrl} />
          <Visualizer songUrl={songUrl}/>
        </div>
        <div id={styles.mainPageSettingsContainer}>
          <VisualizerSettings />
        </div>
      </>
    );
  }
  
  export default MainPage;