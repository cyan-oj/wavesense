import styles from "./Visualizer.module.css";

const TimeDisplay = ({ song }) => {

  let time = "0:00";
  let totalTime = "0:00";

  const timeFormat = (seconds) => {
    const mins = Math.floor(seconds/60);
    const secs = Math.round(seconds % 60).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    });
    return `${mins}:${secs}`;
  }

  time = timeFormat(song.currentTime)
  if (song.buffer.duration) totalTime = timeFormat(song.buffer.duration)
  

  return(
    <div id={styles.timer}>
      <time>{time}</time>
      <time>{totalTime}</time>
    </div>
  )
}

export default TimeDisplay;