import { useEffect, useState } from "react";
import styles from "./Visualizer.module.css";

const TimeDisplay = ({ song }) => {

  const [time, setTime] = useState("0:00");

  const timeFormat = (seconds) => {
    const mins = Math.floor(seconds/60);
    const secs = Math.round(seconds % 60).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    });
    return `${mins}:${secs}`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(timeFormat(song.currentTime))
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, [song])
  
  const totalTime = timeFormat(song.duration)

  return(
    <div id={styles.timer}>
      <time>{time}</time>
      <time>{totalTime}</time>
    </div>
  )
}

export default TimeDisplay;