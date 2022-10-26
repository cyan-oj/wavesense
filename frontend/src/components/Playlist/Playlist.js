import styles from './Playlist.module.css'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getSongs, fetchSongs } from '../../store/songs';
import { useEffect } from 'react';


const Playlist = () => {
    const dispatch = useDispatch();

    const allSongs = useSelector(state => {
     Object.values(state.songs)
    });
    // const allSongs = getSongs();

    useEffect(() => {
        dispatch(fetchSongs());
    }, [dispatch])
    console.log(allSongs)



    const testArray = ['Song 1', 'Song 2', 'Song 3', 'Song 4', 'Song 5', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', ]


    const mappedSongs = testArray.map((song) => {
        return <li className={styles.songListItems}> {song} </li>
    })

    return (
        <>
            <div id={styles.allOfPlaylist}>
                <h2 id={styles.header}>Playlist</h2>
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