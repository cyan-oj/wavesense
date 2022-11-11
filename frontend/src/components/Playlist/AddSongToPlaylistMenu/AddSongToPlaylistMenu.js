import { useSelector } from "react-redux";
import { getPlaylists } from '../../../store/playlists';
import styles from '../Playlist.module.css'

const { useState, useEffect } = require("react")

const AddSongToPlaylistMenu = () => {
    const [showPlaylistsMenu, setShowPlaylistsMenu] = useState(false);
    const allPlaylists = useSelector(getPlaylists);
    const currentUser = useSelector(state => state.session.user);
    const currentUserPlaylists = () => {
        
        if (currentUser && allPlaylists) {
            const filteredPlaylists = allPlaylists.filter(playlist => playlist.creator._id === currentUser._id)
            const mappedCUPlaylists = filteredPlaylists.map((playlist, i) => {
                <li key={i} className={styles.playlistListItems}>
                    <div className={styles.playPauseAndButton}>
                        <button className={styles.buttonStyle} id={playlist._id} >
                            <span className={styles.titleName}>{playlist.title}</span>
                        </button>
                    </div>
                </li>
            }) 
            return (
                <div>
                    {mappedCUPlaylists};
                </div>
            )
        } else {
            return null;
        }
    }

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

    return (
        <div>
            <button onClick={openPlaylistsMenu}>+</button>
            { currentUserPlaylists }
        </div>
    )

}

export default AddSongToPlaylistMenu;