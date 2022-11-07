import styles from './Playlist.module.css'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getSongs, fetchSongs, createSong } from '../../store/songs';
import { useEffect } from 'react';
import Visualizer from '../Visualizer/Visualizer';
import PlaylistSongIndex from './PlaylistSongIndex/PlaylistSongIndex';
import { Modal } from '../../context/Modal';

import { fetchPlaylists } from '../../store/playlists';
import PlaylistFormModal from '../PlaylistForm/PlaylistFormModal';
import Playlists from '../Playlists/Playlists';

const Playlist = ({ songUrl, setSongUrl }) => {
    const dispatch = useDispatch();
    const [showCreateSongModal, setShowCreateSongModal] = useState(false);
    const [showPlaylistFormModal, setShowPlaylistFormModal] = useState(false);
    const allSongs = useSelector(getSongs);
    const [selectedSong, setSelectedSong] = useState('');
    const [minimize, setMinimize] = useState(false);
    const [showPlaylists, setShowPlaylists] = useState(false)
    const [selectedPlaylist, setSelectedPlaylist] = useState(null)

    const waveSenseLogo = () => {
        return (
            <img src='/wavesenselogo.png' id={styles.logo}/>
            );
    };
        
    useEffect(() => {
        dispatch(fetchPlaylists());
        dispatch(fetchSongs());
    }, [dispatch, showPlaylists])

    const handleClick = (e) => {
        e.preventDefault()
        setSelectedSong(e.target.id)
        setSongUrl(e.target.value);
    }

    const handleMinimizeButton = (e) => {
        e.preventDefault();
        if (minimize === true) {
            setMinimize(false);
        } else {
            setMinimize(true)
        }
        console.log("song url?", songUrl)
    }

    const togglePlaylistsSongs = () => {
        if (!showPlaylists) {
            return addSongForm()
        } else {
            return addPlaylistForm()
        }
    }

    const addPlaylistForm = () => {
        return (
            <div id={styles.addSongForm}>
                <button className={styles.addSong} onClick={() => setShowPlaylists(false) && setSelectedPlaylist(null)}>Show All Songs</button>
                <button className={styles.addSong} onClick={() => setShowPlaylistFormModal(true) }> Create Playlist</button>
                {/* <button className={styles.addSong} onClick={() => } >  </button> */}
                {showPlaylistFormModal && <Modal onClose={ () => setShowPlaylistFormModal(false)}> <PlaylistFormModal /> </Modal> }
            </div>
        );
    }

    const addSongForm = () => {
        return (
            <div id={styles.addSongForm}>
                <button className={styles.addSong} onClick={() => setShowPlaylists(true)}>Show Playlists</button>
                <button className={styles.addSong} onClick={() => setShowCreateSongModal(true) }> Add Song</button>
                {showCreateSongModal && <Modal onClose={ () => setShowCreateSongModal(false)}> <PlaylistSongIndex /> </Modal> }
            </div>
        );
    };

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

    const handlePlaylistItemClick = (playlistObject) => {
        setSelectedPlaylist(playlistObject);
        setShowPlaylists(false);
        console.log(selectedPlaylist);
    }
    // const testArray = ['Song 1', 'Song 2', 'Song 3', 'Song 4', 'Song 5', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', ]

    const mappedSongs = allSongs.map((song, i) => {

        return (
                <li key={i} className={styles.songListItems}>
                    <div className={styles.playPauseAndButton}>
                        <button className={styles.buttonStyle} id={song._id} value={song.url} onClick={handleClick}>
                                <span className={styles.titleName}>{song.title}</span>
                                <br></br>
                                <span className={styles.artistName}>{song.artist}</span>
                        </button>
                        <p className={styles.playPause}>DELETE</p>
                    </div>
                </li>
        )
    })

    const mappedPlaylistSongs = () => {
        if (!selectedPlaylist) {
            return mappedSongs;
        } else {
            const mappedSpecificSongs = selectedPlaylist.songs.map((song, i) => {
                console.log('mapped song from specific playlist!')
                return (
                    <li key={i} className={styles.songListItems}>
                        <div className={styles.playPauseAndButton}>
                            <button className={styles.buttonStyle} id={song._id} value={song.url} onClick={handleClick}>
                                    <span className={styles.titleName}>{song.title}</span>
                                    <br></br>
                                    <span className={styles.artistName}>{song.artist}</span>
                            </button>
                            <p className={styles.playPause}>DELETE</p>
                        </div>
                    </li>
                )
            })
            return mappedSpecificSongs
        }
    }



    const showMenu = () => {
        if (!showPlaylists) {
            return mappedPlaylistSongs()
        } else {
            return <Playlists handlePlaylistItemClick={handlePlaylistItemClick} />
        }
    }



    return (
        <>
            <div id={styles.allOfPlaylist} className={minimize ? styles.mini : ''}>
                <h2 id={styles.header}>{waveSenseLogo()}</h2>
                {togglePlaylistsSongs()}
                <br />
                <div>
                    {playlistTab()}
                </div>
                <aside id={styles.playlistContainer}>
                    <ul id={styles.songList}>
                        {showMenu()}
                    </ul>
                </aside>

            </div>
            

        </>
    );
};

export default Playlist;