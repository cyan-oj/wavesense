import styles from './Playlists.module.css'
import { fetchPlaylists, getPlaylists } from '../../store/playlists';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import PlaylistUpdateModal from '../PlaylistEditForm/PlaylistUpdateModal';
import { deletePlaylist } from '../../store/playlists';
import { useState } from 'react';




const Playlists = ({handlePlaylistItemClick}) => {
    const dispatch = useDispatch();
    const allPlaylists = useSelector(getPlaylists);
    // const [showPlaylists, setShowPlaylists] = useState(false);
    const currentUser = useSelector(state => state.session.user);
    const [reload, setReload] = useState(0);

    useEffect(() => {
        dispatch(fetchPlaylists());
        console.log("FETCHING PLAYLISTS");
    }, [dispatch, reload])

    const updateAndDeletePlaylist = (playlist) => {
        const handleDelete = async (e) => {
            await dispatch(deletePlaylist(playlist._id));
            setReload(reload+1);
            // window.location.reload(false);
            // dispatch(fetchPlaylists());
        }

        if (currentUser && (playlist.creator._id === currentUser._id)) {
            return (
                <div className='editPlaylist'>
                    <PlaylistUpdateModal playlist={playlist} />
                    <button onClick={handleDelete} className={styles.playPause}>DELETE</button>
                </div>
            )
        } else {
            return null;
        }
    }


    const mappedPlaylists = allPlaylists.map((playlist, i) => {
        return (
            <li key={i} className={styles.playlistListItems}>
                <div className={styles.playPauseAndButton}>
                    <button className={styles.buttonStyle} id={playlist._id} onClick={(e) => handlePlaylistItemClick(playlist)}>
                            <span className={styles.titleName}>{playlist.title}</span>
                    </button>
                    {updateAndDeletePlaylist(playlist)}
                </div>
            </li>
    )
    })

    return (
        <>
            <div id={styles.playlistsMenuContainer}>
                {mappedPlaylists}
            </div>
        </>
    );
};

export default Playlists;

