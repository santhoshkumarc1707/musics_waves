import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const ViewSongs = () => {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const songref = useRef();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getSongs = useCallback(() => {
    if (songref.current) {
      songref.current.abort();
    }
    songref.current = new AbortController();

    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      signal: songref.current.signal,
    };

    axios
      .get(`${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/songs/${id}`, config)
      .then((res) => {
        setSong(res.data.data); // Save the song data to state
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        setLoading(false);
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          console.error("Error fetching song:", err);
          setError("Error fetching the song. Please try again.");
        }
      });
  }, [id, token]);

  useEffect(() => {
    getSongs();
    return () => {
      if (songref.current) {
        songref.current.abort();
      }
    };
  }, [getSongs]);

  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-700 text-xl">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 text-red-600 p-6 rounded-lg shadow-md">{error}</div>
      </div>
    );
  }

  return (
    <>

      <div className="min-h-screen bg-gray-100 flex flex-col items-center">

        <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl px-2 py-4  mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-24 bg-black text-white py-2 px-4 mt-4 rounded-md hover:bg-black focus:ring-2 focus:ring-black-500 focus:ring-offset-2 focus:outline-none"
          >
            Back
          </button>
          <div className="flex flex-col md:flex-row items-center gap-8">

            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-2xl font-bold">🎵</span>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{song?.title}</h1>
              <div className="text-lg text-gray-600 mb-2">
                <span className="font-semibold">Artist:</span> {song?.artist || "Unknown"}
              </div>
              <div className="text-lg text-gray-600 mb-2">
                <span className="font-semibold">Album:</span> {song?.album || "Unknown"}
              </div>
              <div className="text-lg text-gray-600 mb-2">
                <span className="font-semibold">Genre:</span> {song?.genre || "Not specified"}
              </div>
              <p className="text-gray-600 mt-4">
                <span className="font-semibold">Description:</span>{" "}
                {song?.description || "No description provided."}
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={() => console.log("Play Song")}
              className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition duration-200"
            >
              Play Song
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewSongs;
