import jwtFetch from "./jwt";

export const RECEIVE_SONGS = '/api/RECEIVE_SONGS'
export const RECEIVE_PLAYLIST_SONGS = '/api/RECEIVE_PLAYLIST_SONGS'
export const RECEIVE_SONG = '/api/RECEIVE_SONG'
export const REMOVE_SONG = '/api/REMOVE_SONG'
export const CREATE_SONG = '/api/CREATE_SONG'

export const createSong = (song) => {
    return {
        type: CREATE_SONG,
        song
    }
}

export const receiveSongs = (songs) => {
    return {
        type: RECEIVE_SONGS,
        songs
    };
};

export const receivePlaylistSongs = (playlistId) => {
    return {
        type: RECEIVE_PLAYLIST_SONGS,
        playlistId
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

export const getPlaylistSongs = (playlistId) => ( {songs} ) => {
    if (playlistId && songs) {
        const filteredSongs = Object.values(songs).filter((song) => song.playlistId === playlistId);
        return filteredSongs
    } else {
        return []
    }
}
export const getSongs = ( { songs } ) => songs ? Object.values(songs) : [];
export const getSong = (songId) => ( { songs } ) => songs ? songs[songId] : null;

export const fetchSongs = () => async dispatch => {
    // console.log('catching songs...');
    let res = await jwtFetch('/api/songs');
    let data = await res.json();
    dispatch(receiveSongs(data));
}

export const fetchPlaylistSongs = (playlistId) => async dispatch => {
    console.log('catching playlist specific songs...');
    let res = await jwtFetch(`/api/songs/${playlistId}`);
    let data = await res.json();
    dispatch(receivePlaylistSongs(data))
}

export const fetchSong = (song) => async dispatch => { // may not need, dependent on get above if we also ever need allsongs 
    console.log('catching song...');
    let res = await jwtFetch(`/api/songs/${song.id}`);
    let data = await res.json();
    dispatch(receiveSong(data));
}


// This isn't being used
// export const addSong = (song) => async dispatch => {
//     console.log('adding song...');
//     let res = await jwtFetch(`/api/songs/${song.id}`, {
//         method: 'POST',
//         body: JSON.stringify(song),
//         header: {
//             'Content-Type': '/application/json'
//         }
//     });
//     let data = await res.json();
//     dispatch(createSong(data))
// }

export const deleteSong = (songId) => async dispatch => {
    let res = await jwtFetch(`/api/songs/${songId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': '/application/json'
        }
    });

    // console.log("deleting song: ",songId);
    dispatch(removeSong(songId));
};

const songsReducer = (state = {}, action) => {
    let prevState = {...state};
    switch (action.type) {
        case RECEIVE_SONGS:
            return action.songs;
        case RECEIVE_PLAYLIST_SONGS:
            return {...prevState, [action.playlistId]: action.songs}
        case RECEIVE_SONG: 
            return {...prevState, [action.song.id]: action.song};
        case REMOVE_SONG:
            delete prevState[action.songId];
            return prevState;
        case CREATE_SONG:
            return {...prevState, [action.song.id]: action.song};
        default:
            return prevState;
    };
};

export default songsReducer;