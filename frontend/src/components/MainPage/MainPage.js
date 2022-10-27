import Playlist from "../Playlist/Playlist";
import YouTubeBox from "../YouTubeBox/YouTubeBox";
import Visualizer from "../Visualizer/Visualizer";
import styles from './MainPage.module.css';
import VisualizerSettings from "../VisualizerSettings/VisualizerSettings";


function MainPage() {
    return (
      <>
        <div id={styles.mainPageVideosContainer}>
          <Playlist />
          <Visualizer />
        </div>
        <div id={styles.mainPageSettingsContainer}>
          {/* <VisualizerSettings /> */}
        </div>
      </>
    );
  }
  
  export default MainPage;