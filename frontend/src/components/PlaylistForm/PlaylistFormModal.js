import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "../../context/Modal";
import { createPlaylist } from "../../store/playlists";
import styles from './PlaylistFormModal.module.css'


const PlaylistCreateForm = ({setShowPlaylistModal}) => {
    const currentUser = useSelector( state => state.session.user);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createPlaylist({
            title: title, 
            description: description,
            creator: currentUser
        }))
        setShowPlaylistModal(false);
    }

    return (
        <div className="create-playlist-page">
            <form className="playlist-form" onSubmit={handleSubmit}>
                <h2 id={styles.header}>Create a New Playlist</h2>
                    <input type="text" className={styles.inputFields} value={ title } onChange={(e) => setTitle(e.currentTarget.value)} placeholder="Title" />
                    <input type="text" className={styles.inputFields} value={ description } onChange={(e) => setDescription(e.currentTarget.value)} placeholder="Description" />
                <input type="submit" className={styles.submitPlaylistButton} value="Create Playlist" />
            </form>
        </div>

    );

}


const PlaylistFormModal = () => {
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);

    return (
        <div id='create-playlist-modal'>
            <button onClick={ () => setShowPlaylistModal(true) }> Create Playlist </button>
            { showPlaylistModal && <Modal onClose={ () => setShowPlaylistModal(false)}><PlaylistCreateForm setShowPlaylistModal={setShowPlaylistModal}/></Modal>}
        </div>
    )
}


export default PlaylistFormModal;