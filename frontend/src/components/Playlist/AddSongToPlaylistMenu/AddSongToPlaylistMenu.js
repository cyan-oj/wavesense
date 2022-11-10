const { useState, useEffect } = require("react")

const AddSongToPlaylistMenu = () => {
    const [showPlaylistsMenu, setShowPlaylistsMenu] = useState(false);

    const openPlaylistsMenu = () => {
        if (showPlaylistsMenu) return;
        setShowPlaylistsMenu(true);
    };

    useEffect(() => {
        if (!showPlaylistsMenu) return;

        const closePlaylistsMenu = () => {
            setShowPlaylistsMenu(false);
        };

        document.addEventListener('click', closePlaylistsMenu);

        return () => document.removeEventListener('click', closePlaylistsMenu);

    }, [showPlaylistsMenu])

    return (
        <div>
            <button onClick={openPlaylistsMenu}>+</button>
            { }
        </div>
    )

}

export default AddSongToPlaylistMenu;