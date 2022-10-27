import styles from './Playlist.module.css'
import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getSongs, fetchSongs, createSong } from '../../store/songs';
import { useEffect } from 'react';
import Visualizer from '../Visualizer/Visualizer';

const Playlist = (props) => {
    const dispatch = useDispatch();
    const allSongs = useSelector(getSongs);
    const [selectedSong, setSelectedSong] = useState('');
    const [minimize, setMinimize] = useState(false);
    const hiddenFileInput = useRef(null);

    const waveSenseLogo = () => {
        return (
            <img src='/wavesenselogo.png' id={styles.logo}/>
        );
    };

    useEffect(() => {
        dispatch(fetchSongs());
        console.log(allSongs[0])
    }, [dispatch])

    // useEffect(() => {
    //     console.log(minimize);

    // }, [minimize])

    // const handleClick = (e) => {
    //     e.preventDefault()
    //     setSelectedSong(e.target.id)
    //     // console.log('e.target', e.target)
    //     // console.log('selectedSong',selectedSong)
    //     props.setSongUrl(e.target.value);
    // }

    const handleMinimizeButton = (e) => {
        e.preventDefault();
        if (minimize === true) {
            setMinimize(false);

        } else {
            setMinimize(true)
        }
    }

    const handleFileSubmitClick = () => {
        hiddenFileInput.current.click();
    }

    const handleFileSubmit = (e) => {
        e.preventDefault();
        const fileSong = e.currentTarget.files[0];
        dispatch(createSong(fileSong))
    }

    const playlistTab = () => {
        if (minimize === true) {
            return (
                <button className={styles.minimizeButton} onClick={handleMinimizeButton}>+</button>
            );
        } else {
            return (
                <button className={styles.minimizeButton} onClick={handleMinimizeButton}>-</button>
            );
        };
    }   
    // const testArray = ['Song 1', 'Song 2', 'Song 3', 'Song 4', 'Song 5', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', ]

    const mappedSongs = allSongs.map((song, i) => {
        return (
                <li key={i} className={styles.songListItems}>
                    <div className={styles.playPauseAndButton}>
                        <p className={styles.playPause}>PAUSE</p>
                        <button className={styles.buttonStyle} id={song._id} value={song._id}>
                                <span className={styles.titleName}>{song.title}</span>
                                <br></br>
                                <span className={styles.artistName}>{song.artist}</span>
                        </button>
                    </div>
                </li>
        )
    })

    return (
        <>
            <div id={styles.allOfPlaylist} className={minimize ? styles.mini : ''}>
                <h2 id={styles.header}>{waveSenseLogo()}</h2>
                <button id={styles.addSong} onClick={handleFileSubmitClick}>Add Song</button>
                <input 
                        type="file"
                        ref={hiddenFileInput}
                        id='add-song'
                        accept="audio/*"
                        onCHange={(e) => handleFileSubmit(e)}
                        style={ {display: 'none'}}
                    />
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