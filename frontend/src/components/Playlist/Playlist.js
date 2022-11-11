import styles from './Playlist.module.css'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getSongs, fetchSongs, deleteSong } from '../../store/songs';
import { useEffect } from 'react';
import Visualizer from '../Visualizer/Visualizer';
import { Modal } from '../../context/Modal';

import { fetchPlaylists } from '../../store/playlists';
import Playlists from '../Playlists/Playlists';
import { PlaylistCreateForm } from '../PlaylistForm/PlaylistFormModal';
import SongUploadForm from './SongUploadForm/SongUploadForm';
import AddSongToPlaylistMenu from './AddSongToPlaylistMenu/AddSongToPlaylistMenu';

const Playlist = ({ songUrl, setSongUrl }) => {
    const dispatch = useDispatch();
    const [showCreateSongModal, setShowCreateSongModal] = useState(false);
    const [showPlaylistFormModal, setShowPlaylistFormModal] = useState(false);
    const allSongs = useSelector(getSongs);
    const [selectedSong, setSelectedSong] = useState('');
    const [minimize, setMinimize] = useState(false);
    const [showPlaylists, setShowPlaylists] = useState(false)
    const [selectedPlaylist, setSelectedPlaylist] = useState(null)
    const currentUser = useSelector(state => state.session.user);

    const [deletes, setDeletes] = useState(0);

    const waveSenseLogo = () => {
        return (
            <img src='/wavesenselogo.png' id={styles.logo}/>
            );
    };
        
    useEffect(() => {
        dispatch(fetchPlaylists());
        dispatch(fetchSongs());
    }, [dispatch, showPlaylists, deletes])

    const handleClick = (e) => {
        e.preventDefault();
        setSelectedSong(e.target.id);
        setSongUrl(e.target.value);
    }

    const handleMinimizeButton = (e) => {
        e.preventDefault();
        if (minimize === true) {
            setMinimize(false);
        } else {
            setMinimize(true);
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
                { currentUser && <button className={styles.addSong} onClick={() => setShowPlaylistFormModal(true) }> Create Playlist</button>}
                {/* <button className={styles.addSong} onClick={() => } >  </button> */}
                {showPlaylistFormModal && <Modal onClose={() => setShowPlaylistFormModal(false)}> <PlaylistCreateForm setShowPlaylistFormModal={setShowPlaylistFormModal}/> </Modal> }
            </div>
        );
    }

    const openSongForm = () => {
        if(currentUser){
            setShowCreateSongModal(true)
        } else {
            alert('You Must Be Logged In');
        }
    }
    const addSongForm = () => {
        return (
            <div id={styles.addSongForm}>
                <button className={styles.addSong} onClick={() => setShowPlaylists(true)}>Show Playlists</button>
                <button className={styles.addSong} onClick={openSongForm}> Add Song</button>
                {showCreateSongModal && <Modal onClose={ () => setShowCreateSongModal(false)}> <SongUploadForm close={setShowCreateSongModal} reload={setDeletes}/> </Modal> }
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

    const handleDelete = (e) => {
        e.preventDefault();
        // console.log(e.target.value);
        dispatch(deleteSong(e.target.id));
        // window.location.reload(false); //too fast
        setDeletes(deletes+1);
    }

    const handleAdd = (e) => {
        e.preventDefault();
        console.log(`handle add: add song id ${e.target.id} to playlist`)
    }

    const mappedSongs = allSongs.map((song, i) => {

        return (
                <li key={i} className={styles.songListItems}>
                    <div className={styles.playPauseAndButton}>
                        <button className={styles.buttonStyle} id={song._id} value={song.url} onClick={handleClick}>
                                <span className={styles.titleName}>{song.title}</span>
                                <br></br>
                                <span className={styles.artistName}>{song.artist}</span>
                        </button>
                        <p className={styles.playPause} value={song} id={song._id} onClick={handleDelete}>DELETE</p>
                        {/* <p className={styles.playPause} value={song._id} id={song._id} onClick={handleAdd}>+</p> */}
                        <AddSongToPlaylistMenu />
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