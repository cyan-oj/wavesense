import styles from './Playlists.module.css'
import { fetchPlaylists, getPlaylists } from '../../store/playlists';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import PlaylistUpdateModal from '../PlaylistEditForm/PlaylistUpdateModal';
import { deletePlaylist } from '../../store/playlists';




const Playlists = ({handlePlaylistItemClick}) => {
    const dispatch = useDispatch();
    const allPlaylists = useSelector(getPlaylists);
    // const [showPlaylists, setShowPlaylists] = useState(false);
    const currentUser = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(fetchPlaylists());
    }, [dispatch])

    const updateAndDeletePlaylist = (playlist) => {
        const handleDelete = (e) => {
            dispatch(deletePlaylist(playlist._id));
            window.location.reload(false);
        }

        if (currentUser && (playlist.creator._id === currentUser._id)) {
            return (
                <div className={styles.editPlaylist}>
                    <PlaylistUpdateModal playlist={playlist} />
                    <button onClick={handleDelete} className={styles.playlistUpdate}>DELETE</button>
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

