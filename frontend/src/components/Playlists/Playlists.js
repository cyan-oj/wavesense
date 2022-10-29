import styles from './Playlists.module.css'
import { fetchPlaylists, fetchPlaylist, getPlaylist, getPlaylists } from '../../store/playlists';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';




const Playlists = () => {
    const dispatch = useDispatch();
    const allPlaylists = useSelector(getPlaylists)

    useEffect(() => {
        dispatch(fetchPlaylists());
    }, [dispatch])

    const mappedPlaylists = allPlaylists.map((playlist, i) => {
        return (
            <li key={i} className={styles.songListItems}>
                <div className={styles.playPauseAndButton}>
                    <button className={styles.buttonStyle} id={playlist._id}>
                            <span className={styles.titleName}>{playlist.title}</span>
                    </button>
                    <p className={styles.playPause}>DELETE</p>
                </div>
            </li>
    )
    })


    return (
        <>
            <div id={styles.playlistsMenuContainer}>
                <h1>hello worlddddddddddddddd</h1>
                {mappedPlaylists}
            </div>
        </>
    );
};

export default Playlists;

