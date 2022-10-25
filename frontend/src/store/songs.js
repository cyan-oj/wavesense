import jwtFetch from "./jwt";

export const RECEIVE_SONGS = '/api/RECEIVE_SONGS'
export const RECEIVE_SONG = '/api/RECEIVE_SONG'
export const REMOVE_SONG = '/api/REMOVE_SONG'

export const receiveSongs = (songs) => {
    return {
        type: RECEIVE_SONGS,
        songs
    };
};

export const receiveSong = (song) => {
    return {
        type: RECEIVE_SONG,
        song
    };
};

export const removeSong = (songId) => {
    return {
        type: REMOVE_SONG,
        songId
    };
};

export const getSongs = ( { songs } ) => songs ? Object.values(songs) : [];
export const getSong = (songId) => ( { songs } ) => songs ? songs[songId] : null;

export const fetchSongs = () => async dispatch => {
    console.log('catching songs...');
    let res = await jwtFetch('/api/songs');
    let data = await res.json();
    dispatch(receiveSongs(data.songs));
}

export const fetchSong = (song) => async dispatch => {
    console.log('catching song...');
    let res = await jwtFetch(`/api/songs/${song.id}`);
    let data = await res.json();
    dispatch(receiveSong(data));
}

export const deleteSong = (songId) => async dispatch => {
    await jwtFetch(`/api/songs/${songId}`, {
        method: 'DELETE',
        header: {
            'Content-Type': '/application/json'
        }
    });
};

const songsReducer = (state= {}, action) => {
    let prevState = {...state};
    switch (action.type) {
        case RECEIVE_SONGS:
            return action.songs;
        case RECEIVE_SONG: 
            return {...prevState, [action.song.id]: action.song};
        case REMOVE_SONG:
            delete prevState[action.songId];
            return prevState;
        default:
            return prevState;
    };
};

export default songsReducer;