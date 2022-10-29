import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "../../context/Modal";
import { createPlaylist } from "../../store/playlists";


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
                <h2>Create a New Playlist</h2>
                <label>
                    <input type="text" value={ title } onChange={(e) => setTitle(e.currentTarget.value)} placeholder="Title" />
                </label>
                <label>
                    <input type="text" value={ description } onChange={(e) => setDescription(e.currentTarget.value)} placeholder="Description" />
                </label>
                <input type="submit" value="Create Playlist" />
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