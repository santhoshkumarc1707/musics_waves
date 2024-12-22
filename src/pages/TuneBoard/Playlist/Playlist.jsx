import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ToggleSongButton from "../../../Components/TogglesongButton/TogglesongButton";

const PlayList = () => {
  const playlistRef = useRef(null);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const id = useSelector((state) => state.auth.id);
  const [playlistData, setplaylistData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const fetchplaylist = useCallback(
    async (signal) => {
      try {
        setIsLoading(true);
        const config = {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          signal,
        };

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/playlists?page=${currentPage}&limit=10`,
          config
        );

        setplaylistData(response.data?.data || []);
        setTotalPages(response.data?.totalPages || 1);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Error fetching playlists:", error);
        }
      }
    },
    [token, currentPage]
  );

  const handleDeleteSong = async (id) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/playlists/${id}`,
        config
      );
      setplaylistData((prev) => prev.filter((playlist) => playlist._id !== id));
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    playlistRef.current = abortController;

    fetchplaylist(abortController.signal);

    return () => {
      if (playlistRef.current) {
        playlistRef.current.abort();
      }
    };
  }, [fetchplaylist]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  return (
    <div className="p-5">
      <div className="flex justify-end mb-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow"
          onClick={() => navigate('/playlist/create-playlist')}
        >
          + Create Playlist
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : playlistData && playlistData.length > 0 ? (
          playlistData.map((playlist, idx) => (
            playlist._id === id || user && <div
              key={playlist._id || idx}
              className="bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105  overflow-hidden"
            >
              <img
                src={"https://via.placeholder.com/200" || playlist.img}
                alt={"playlist"}
                // className="rounded-lg mb-4"
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{playlist.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {playlist.songs.length} songs
                </p>
                <div className="flex justify-between items-center">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => navigate(`/playlist/edit/${playlist._id}`)}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  
                  <button
                    className="text-green-500 hover:text-green-700"
                    onClick={() => navigate(`/playlist/view/${playlist._id}`)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteSong(playlist._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No Playlist found</p>
        )}
      </div>
      <div className="flex justify-center items-center py-4">
        <button
          className="px-3 py-1 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="mx-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PlayList;

