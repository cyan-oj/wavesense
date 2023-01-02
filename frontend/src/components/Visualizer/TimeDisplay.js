import styles from "./Visualizer.module.css";

const TimeDisplay = ({ song, startTime }) => {

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

  time = timeFormat(song.context.currentTime - startTime)
  if (song.buffer.duration) totalTime = timeFormat(song.buffer.duration)
  

  return(
    <div>
      <input 
        type="range" 
        value={ song.context.currentTime - startTime } 
        readOnly={true}
        min={0} 
        max={ song.buffer.duration }
      />
      <div id={styles.timer}>
        <time>{time}</time>
        <time>{totalTime}</time>
      </div>
    </div>
  )
}

export default TimeDisplay;