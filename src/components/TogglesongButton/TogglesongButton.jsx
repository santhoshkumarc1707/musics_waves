import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const ToggleSongButton = ({ playlistId, songId }) => {
    const [isSongAdded, setIsSongAdded] = useState(false);
    const token = useSelector((state) => state.auth.token);

    const handleToggleSong = async () => {
        try {
            const config = {
                headers: {
                   "x-auth-token": token,
            },
        };

        if (isSongAdded) {
            // Remove song
            await axios.put(
                `${import.meta.env.VITE_BASE_URL}/api/playlists/remove-song`,
                { playlistId, songId },
                config
            );
        } else {
            // Add song
            await axios.put(
                `${import.meta.env.VITE_BASE_URL}/api/playlists/add-song`,
                { playlistId, songId },
                config
            );
        }
        // Toggle the button state
        setIsSongAdded(!isSongAdded);
    } catch (error) {
        console.error("Error toggling song:", error);
    }
};

return (
    <button
        onClick={handleToggleSong}
        className={`px-4 py-2 rounded ${isSongAdded ? "bg-red-500 text-white" : "bg-green-500 text-white"
            }`}
    >
        {isSongAdded ? "Remove Song" : "Add Song"}
    </button>
);
};

export default ToggleSongButton;
