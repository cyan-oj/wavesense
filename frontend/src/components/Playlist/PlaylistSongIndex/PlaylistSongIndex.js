import { useState } from 'react';
import jwtFetch from '../../../store/jwt';
import styles from './PlaylistSongIndex.module.css'


const PlaylistSongIndex = () => {

    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [file, setFile] = useState(null);

    const handleChange = (e)=>{
        e.preventDefault();
        setFile(e.currentTarget.files[0]);
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('audio-upload', file);

        const res = await jwtFetch('/api/songs', {
            method: 'POST',
            body: formData
        });

        // const res2 = await res.json();
        // console.log(res2);
    }

    return (
        <>
            <h1>TEST</h1>
            <form onSubmit={handleSubmit}>
                <input placeholder='title' value={title} onChange={(e)=>setTitle(e.target.value)}/>
                <input placeholder='artist' value={artist} onChange={(e)=>setArtist(e.target.value)}/>
                <input type='file' onChange={handleChange}/>
                <br></br>
                <input type='submit' />
            </form>
        </>
    );
};

export default PlaylistSongIndex;
