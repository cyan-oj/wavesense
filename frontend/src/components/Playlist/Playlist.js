import styles from './Playlist.module.css'


const Playlist = () => {

    const testArray = ['Song 1', 'Song 2', 'Song 3', 'Song 4', 'Song 5', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', 'Song Test', ]


    const mappedSongs = testArray.map((song) => {
        return <li className={styles.songListItems}> {song} </li>
    })

    return (
        <>
            <div id={styles.allOfPlaylist}>
                <h2 id={styles.header}>Playlist</h2>
                <aside id={styles.playlistContainer}>
                    <ul id={styles.songList}>
                        {mappedSongs}
                    </ul>
                </aside>
            </div>
        </>
    );
};

export default Playlist;