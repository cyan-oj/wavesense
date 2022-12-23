import { useDispatch, useSelector } from "react-redux";
import { getPlaylists, updatePlaylist } from '../../../store/playlists';
import styles from '../Playlist.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons'

const { useState, useEffect } = require("react")

const AddSongToPlaylistMenu = ({song}) => {
    const [showPlaylistsMenu, setShowPlaylistsMenu] = useState(false);
    const allPlaylists = useSelector(getPlaylists);
    const currentUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    

    const ensureCurrentUser = () => {
        return (
            <div className={styles.addButton}>
                <button onClick={openPlaylistsMenu} className={styles.addDelete} id={styles.addToPlaylist}><FontAwesomeIcon icon={faSquarePlus} size="xl" /></button>
                <ul id={showPlaylistsMenu && styles.dropDownNotHidden} className={styles.dropDownMenuPlaylists}>
                    {currentUserPlaylists} 
                </ul>
            </div>
        )

    };


    const currentUserPlaylists = (allPlaylists
        // .filter(playlist => {
        //     let a = playlist.creator._id
        //     let b = currentUser._id
        //     return a === b;
        // })
        )
        .map((playlist, i) => {
        
        const handleAdd = (e) => {
            e.preventDefault();
            console.log(`handle add: add song id ${song._id} to playlist ${e.target.id}`)
            playlist.songs.push(song._id);
            dispatch(updatePlaylist(playlist));
            setShowPlaylistsMenu(false);
        }
        
        if (currentUser && playlist.creator._id === currentUser._id) {
            return (
                <li key={i} className={styles.playlistListItems}>
                    <div className={styles.playPauseAndButton}>
                        <button className={styles.buttonStyle} id={playlist._id} onClick={handleAdd}>
                            <span className={styles.titleName}>{playlist.title}</span>
                        </button>
                    </div>
                </li>
            )
        } 

    });

    const openPlaylistsMenu = () => {
        if (showPlaylistsMenu) return;
        setShowPlaylistsMenu(true);
    };

    useEffect(() => {
        if (!showPlaylistsMenu) return;
        const closePlaylistsMenu = () => {
            setShowPlaylistsMenu(false);
        };

        document.addEventListener('click', closePlaylistsMenu);

        return () => document.removeEventListener('click', closePlaylistsMenu);

    }, [showPlaylistsMenu])

    // console.log(currentUser)
    return (
        <div>
            {currentUser ? ensureCurrentUser() : null }
        </div>
    )

}

export default AddSongToPlaylistMenu;