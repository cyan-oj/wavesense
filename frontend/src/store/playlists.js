import jwtFetch from "./jwt";

export const RECEIVE_PLAYLISTS = '/api/RECEIVE_PLAYLISTS'
export const RECEIVE_PLAYLIST = '/api/RECEIVE_PLAYLIST'
export const REMOVE_PLAYLIST = '/api/REMOVE_PLAYLIST'

export const receivePlaylists = (playlists) => ({
    type: RECEIVE_PLAYLISTS,
    playlists
})

export const receivePlaylist = (playlist) => ({
    type: RECEIVE_PLAYLIST,
    playlist
})

export const removePlaylist = (playlistId) => ({
    type: REMOVE_PLAYLIST,
    playlistId
})

export const getPlaylists = ({playlists}) => (playlists ? Object.values(playlists) : [])
export const getPlaylist = (playlistId) => ({playlists}) => ( playlists ? playlists[playlistId] : null )

export const fetchPlaylists = () => async dispatch => {
    const res = await jwtFetch('/api/playlists');
    const data = await res.json();
    dispatch(receivePlaylists(data))
}

export const fetchPlaylist = (playlistId) => async dispatch => {
    const res = await jwtFetch(`/api/playlists/${playlistId}`);
    const data = await res.json();
    dispatch(receivePlaylist(data))
}

export const createPlaylist = (playlist) => async dispatch => {
    const res = await jwtFetch('/api/playlists', {
        method: "POST",
        body: JSON.stringify(playlist)
    });
    const data = await res.json();
    dispatch(receivePlaylist(data))
}

export const updatePlaylist = (playlist) => async dispatch => {
    const res = await jwtFetch(`/api/playlists/${playlist.id}`,{
        method: 'PATCH',
        body: JSON.stringify(playlist)
    });
    const data = await res.json();
    dispatch(receivePlaylist(data))
}

export const deletePlaylist = (playlistId) => async dispatch => {
    await jwtFetch(`/api/playlists/${playlistId}`, {method: 'DELETE'});
    dispatch(removePlaylist(playlistId))
}

const playlistsReducer = ( state = {}, action ) => {
    const nextState = {...state}
    switch (action.type) {
        case RECEIVE_PLAYLISTS:
            return { ...state, ...action.playlists }
        case RECEIVE_PLAYLIST:
            const playlist = action.playlist
            return { ...state, [playlist.id]: playlist }
        case REMOVE_PLAYLIST: 
            delete nextState[action.playlistId]
            return nextState;
        default:
            return state;
    }
};

export default playlistsReducer;