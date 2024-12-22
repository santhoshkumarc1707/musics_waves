import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Songs = () => {
  const songsRef = useRef(null); // Initialize ref to store AbortController
  const token = useSelector((state) => state.auth.token); // Get token from Redux

  const [songsData, setSongsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const navigate=useNavigate();

  const fetchSongs = useCallback(
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
          `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/songs?page=${currentPage}&limit=10`,
          config
        );

        setSongsData(response.data?.data || []); // Update state with song data
        setTotalPages(response.data?.totalPages || 1); // Update total pages
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Error fetching songs:", error);
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
        `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/songs/${id}`,
        config
      );
      // Remove deleted song from state
      setSongsData((prev) => prev.filter((song) => song._id !== id));
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    songsRef.current = abortController;

    fetchSongs(abortController.signal);

    // Cleanup on component unmount
    return () => {
      if (songsRef.current) {
        songsRef.current.abort();
      }
    };
  }, [fetchSongs]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const tableHeader = [
    "ID",
    "Artist",
    "Duration",
    "Name",
    "Songs",
    "Action",
  ];

  return (
    <div>
      <div className="m-2 flex text-center text-xl  justify-end" >
        
        <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded" onClick={()=>navigate('/songs/create')} >+ create</button>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <p className="text-center text-gray-500 py-4">Loading...</p>
        ) : songsData && songsData.length > 0 ? (
          <>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  {tableHeader?.map((th, idx) => (
                    <th
                      key={idx}
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b"
                    >
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {songsData?.map((song, idx) => (
                  <tr
                    key={song._id || idx}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      {song.artist}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      {song.duration}
                    </td>
                   
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      {song.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      {song.song}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b flex space-x-4">
                      <button className="text-blue-500 hover:text-blue-700" onClick={()=>navigate(`/songs/edit/${song._id}`)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button className="text-green-500 hover:text-green-700" onClick={()=>navigate(`/songs/view/${song._id}`)} >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteSong(song._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
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
          </>
        ) : (
          <p className="text-center text-gray-500 py-4">No songs found</p>
        )}
      </div>
    </div>
  );
};

export default Songs;
