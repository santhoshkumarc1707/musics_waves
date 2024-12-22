import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ListAlbum() {
    const [data, setData] = useState([]);
    const token = useSelector((state) => state.auth.token);
    
    console.log('Token:', token); // Log token for debugging

    const navigate = useNavigate();

    const fetchAlbums = useCallback(async () => {
        if (!token) {
            toast.error("Token is missing or invalid");
            return;
        }

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/album/list`, {
                headers: {
                    "x-auth-token": token,
                },
            });

            if (response.data.success) {
                setData(response.data.albums);
            } else {
                toast.error("Failed to fetch albums");
            }
        } catch (error) {
            console.error("Error fetching albums:", error.response?.data || error.message);
            toast.error("Album List Error");
        }
    }, [token]);

    const removeAlbum = async (id) => {
        if (!token) {
            toast.error("Token is missing or invalid");
            return;
        }

        try {
            const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/album/remove/${id}`, {
                headers: {
                    "x-auth-token": token,
                },
            });

            if (response.data.success) {
                toast.success(response.data.message);
                await fetchAlbums();
            } else {
                toast.error("Failed to remove album");
            }
        } catch (error) {
            console.error("Error removing album:", error.response?.data || error.message);
            toast.error("Song Remove Error");
        }
    };

    useEffect(() => {
        if (token) {
            fetchAlbums();
        } else {
            toast.error("Token is missing or invalid");
        }
    }, [fetchAlbums, token]);

    return (
        <div>
            <div className="m-2 flex text-center text-xl justify-end">
                <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded" onClick={() => navigate('/add-album')}>
                    + create
                </button>
            </div>

            <p>All Albums List</p>
            <hr />
            <div>
                <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center justify-items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Description</b>
                    <b>Album Colour</b>
                    <b>Action</b>
                </div>
                {data.map((item, index) => (
                    <div key={index} className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center justify-items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5">
                        <img className='w-12' src={item.image} alt={item.name} />
                        <p>{item.name}</p>
                        <p>{item.desc}</p>
                        <input type="color" value={item.bgColour || "#000000"} readOnly />
                        <p className='font-bold cursor-pointer hover:text-red-500' onClick={() => removeAlbum(item._id)}>X</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListAlbum;

