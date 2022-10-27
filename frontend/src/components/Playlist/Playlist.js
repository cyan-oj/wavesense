import styles from './Playlist.module.css'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getSongs, fetchSongs } from '../../store/songs';
import { useEffect } from 'react';
import Visualizer from '../Visualizer/Visualizer';

const Playlist = () => {
    const dispatch = useDispatch();
    const allSongs = useSelector(getSongs)
    const [selectedSong, setSelectedSong] = useState('')
    const [minimize, setMinimize] = useState(false)

    useEffect(() => {
        dispatch(fetchSongs());
        console.log(allSongs[0])
    }, [dispatch])

    // useEffect(() => {
    //     console.log(minimize);

    // }, [minimize])

    const handleClick = (e) => {
        e.preventDefault()
        setSelectedSong(e.target.value)
        console.log('e.target', e.target)
        console.log('selectedSong',selectedSong)
    }

    const handleMinimizeButton = (e) => {
        e.preventDefault();
        if (minimize === true) {
            setMinimize(false);

        } else {
            setMinimize(true)
        }
    }

    const playlistTab = () => {
        if (minimize === true) {
            return (
                <button className={styles.minimizeButton} onClick={handleMinimizeButton}>-</button>
            );
        } else {
            return (
                <button className={styles.maximizeButton} onClick={handleMinimizeButton}>+</button>
            );
        };
    }   
    // const testArray = ['Song 1', 'Song 2', 'Song 3', 'Song 4', 'Song 5', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', ]

    const mappedSongs = allSongs.map((song, i) => {
        return <li key={i} className={styles.songListItems}>
                <div className={styles.playPauseAndButton}>
                    <p className={styles.playPause}>PAUSE</p>
                    <button className={styles.buttonStyle} id={song._id} value={song._id} onClick={handleClick}>
                            <span className={styles.titleName}>{song.title}</span>
                            <br></br>
                            <span className={styles.artistName}>{song.artist}</span>
                    </button>
                </div>
             </li>
    })

    return (
        <>
            <div id={styles.allOfPlaylist} className={minimize ? styles.mini : ''}>
                <h2 id={styles.header}>Playlist Name</h2>
                <p> {selectedSong} </p>
                <br />
                <div>
                    {playlistTab()}
                </div>
                <aside id={styles.playlistContainer}>
                    <ul id={styles.songList}>
                        {mappedSongs}
                    </ul>
                </aside>
            </div>
            

        </>
    );
};

export default Playlist;