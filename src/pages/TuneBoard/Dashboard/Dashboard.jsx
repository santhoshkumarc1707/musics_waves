import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Dashboardpopup from "./Dashboardpopup";

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playlistData, setPlaylistData] = useState([]);
  const playlistRef = useRef(null);
  const token = useSelector((state) => state.auth.token);
  const id = useSelector((state) => state.auth.id);

  // Function to fetch playlist data
  const fetchPlaylist = useCallback(
    async (signal, endpoint) => {
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
          `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}${endpoint}`,
          config
        );

        setPlaylistData((prevData) => [
          ...prevData,
          ...(response.data?.data || []),
        ]);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Error fetching playlist:", error.response?.data || error.message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  // UseEffect to fetch data on mount
  useEffect(() => {
    const abortController = new AbortController();
    playlistRef.current = abortController;

    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchPlaylist(abortController.signal, "/api/playlists/random"),
          fetchPlaylist(abortController.signal, `/api/songs/random-songs/${id}`),
        ]);
      } catch (error) {
        console.error("Error in fetching playlists:", error);
      }
    };

    fetchAllData();

    return () => {
      if (playlistRef.current) {
        playlistRef.current.abort();
      }
    };
  }, [fetchPlaylist, id]);

  // Handle track click to open modal
  const handleTrackClick = (track) => {
    setCurrentTrack(track);
    setShowModal(true);
  };
console.log(playlistData,"fff");

  return (
    <main className="flex-1 p-6 overflow-y-auto h-full">
      {/* Billboard Topchart Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Billboard Topchart</h2>
        <div className="grid grid-cols-3 gap-6">
          {playlistData.map((track, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
              onClick={() => handleTrackClick(track)}
            >
              <img
                src={track?.image || "https://via.placeholder.com/200"}
                alt="Track Cover"
                className="rounded-lg mb-4"
              />
              <h3 className="text-lg font-medium text-gray-800 truncate">
                {track?.name || "Unknown Track"}
              </h3>
            </div>
          ))}
        </div>
        {isLoading && <p className="text-center mt-4">Loading...</p>}
      </section>

      {/* Modal */}
      {showModal && (
        <Dashboardpopup currentTrack={currentTrack} setShowModal={setShowModal} />
      )}

      {/* Recently Hit Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Recently Hit</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          {["The Box", "Blinding Lights", "Circles"].map((song, index) => (
            <div
              key={song}
              className="grid grid-cols-6 items-center py-2 border-b border-gray-200 last:border-none"
            >
              <p className="col-span-1 text-gray-600 font-medium">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="col-span-3 text-gray-800">{song}</p>
              <p className="col-span-1 text-gray-600">3:24</p>
              <button className="col-span-1 text-red-500 hover:text-red-600">
                ❤️
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
