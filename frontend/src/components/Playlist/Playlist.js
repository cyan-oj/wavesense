import styles from './Playlist.module.css'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getSongs, fetchSongs } from '../../store/songs';
import { useEffect } from 'react';


const Playlist = () => {
    const dispatch = useDispatch();

    const allSongs = useSelector(getSongs)

    useEffect(() => {
        dispatch(fetchSongs());
        console.log(allSongs[0])
    }, [dispatch])

    const [selectedSong, setSelectedSong] = useState('hello world')

    const handleClick = (e) => {
        e.preventDefault()
        setSelectedSong(e.target.value)
        console.log('e.target', e.target)
        console.log('selectedSong',selectedSong)
    }

    // const testArray = ['Song 1', 'Song 2', 'Song 3', 'Song 4', 'Song 5', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', ]

    const mappedSongs = allSongs.map((song, i) => {
        return <li key={i} className={styles.songListItems}  >
                <button id={song._id} value={song._id} onClick={handleClick}>
                        {song.title}
                        {song.artist}
                </button>
             </li>
    })

    return (
        <>
            <div id={styles.allOfPlaylist}>
                <h2 id={styles.header}>Playlist</h2>
                <p> {selectedSong} </p>
                <br />
                <div>
                    <button className={styles.playlistButtons}>+</button>
                    <button className={styles.playlistButtons}>-</button>
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