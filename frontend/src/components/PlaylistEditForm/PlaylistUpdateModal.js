import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "../../context/Modal";
import { updatePlaylist } from "../../store/playlists";


const PlaylistUpdateForm = ({ setShowPlaylistUpdateModal, playlist }) => {
    const currentUser = useSelector(state => state.session.user);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        playlist.title = title;
        playlist.description = description;
        dispatch(updatePlaylist(playlist))
        setShowPlaylistUpdateModal(false);
    }

    return (
        <div className="update-playlist-page">
            <form className="playlist-form" onSubmit={handleSubmit}>
                <h2>Update Playlist</h2>
                <label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.currentTarget.value)} placeholder="Title" />
                </label>
                <label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.currentTarget.value)} placeholder="Description" />
                </label>
                <input type="submit" value="Update Playlist" />
            </form>
        </div>

    );

}


const PlaylistUpdateModal = ({playlist}) => {
    const [showPlaylistUpdateModal, setShowPlaylistUpdateModal] = useState(false);

    return (
        <div id='update-playlist-modal'>
            <button onClick={() => setShowPlaylistUpdateModal(true)}> Update </button>
            {showPlaylistUpdateModal && <Modal onClose={() => setShowPlaylistUpdateModal(false)}><PlaylistUpdateForm setShowPlaylistUpdateModal={setShowPlaylistUpdateModal} playlist={playlist} /></Modal>}
        </div>
    )
}


export default PlaylistUpdateModal;