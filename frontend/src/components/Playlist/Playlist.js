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
    const [showAddToPlaylistMenu, setShowAddToPlaylistMenu] = useState(false)
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
                        <p className={styles.addDelete} value={song} id={song._id} onClick={handleDelete}>
                            <svg id={styles.trashcan}>
                            <path d="M16 6V4.5C16 3.12 14.88 2 13.5 2h-3C9.11 2 8 3.12 8 4.5V6H3v2h1.06l.81 11.21C4.98 20.78 6.28 22 7.86 22h8.27c1.58 0 2.88-1.22 3-2.79L19.93 8H21V6h-5zm-6-1.5c0-.28.22-.5.5-.5h3c.27 0 .5.22.5.5V6h-4V4.5zm7.13 14.57c-.04.52-.47.93-1 .93H7.86c-.53 0-.96-.41-1-.93L6.07 8h11.85l-.79 11.07zM9 17v-6h2v6H9zm4 0v-6h2v6h-2z"></path>
                            </svg>
                        </p>
                        <AddSongToPlaylistMenu song={song}/>
                    </div>
                </li>
        )
    })

    const mappedPlaylistSongs = () => {
        if (!selectedPlaylist) {
            return mappedSongs;
        } else {
            const mappedSpecificSongs = selectedPlaylist.songs.map((songId, i) => {
                console.log('mapped song from specific playlist!')
                return allSongs.map((song, i) => {
                    if (songId == song._id) {
                        console.log(songId)
                        console.log(song.title)
                        return (
                            <li key={i} className={styles.songListItems}>
                                <div className={styles.playPauseAndButton}>
                                    <button className={styles.buttonStyle} id={song._id} value={song.url} onClick={handleClick}>
                                            <span className={styles.titleName}>{song.title}</span>
                                            <br></br>
                                            <span className={styles.artistName}>{song.artist}</span>
                                    </button>
                                    <p className={styles.addDelete}>DELETE</p>
                                </div>
                            </li>
                        )
                    }
                })
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