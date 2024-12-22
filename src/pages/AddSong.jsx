import { assets } from "../assets/admin-assets/assets"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AddSong() {

    const [image, setImage] = useState(false);
    const [song, setSong] = useState(false);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [album, setAlbum] = useState("none");
    const [loading, setLoading] = useState(false);
    const [albumData, setAlbumData] = useState([]);
    const token=useSelector((state)=>state.auth.token);
   const navigate=useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = {
                headers: {
                  "x-auth-token": token,
                },
            }
            const formData = new FormData();

            formData.append('name', name);
            formData.append('desc', desc);
            formData.append('image', image);
            formData.append('audio', song);
            formData.append('album', album);

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/song/add`, formData,config);

            if (response.data.success) {
                toast.success("Song Added");
                navigate("/list-song")
                setName("");
                setDesc("");
                setAlbum("none");
                setImage(false);
                setSong(false);
            } else {
                toast.error("Something went wrong.");
            }

        } catch (error) {
            console.log('error', error)
            toast.error("Song Add Error");
        }
        setLoading(false);
    }

    const loadAlbumData = async () => {
        try {
            
            const config = {
                headers: {
                    "x-auth-token": token,
                },
            };
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/album/list`,config);

            if (response.data.success) {
                setAlbumData(response.data.albums)
            }

        } catch (error) {
            console.log('error', error)
            toast.error("Add a Album first..");
        }
    }

    useEffect(() => {
        loadAlbumData();
    }, [])
    return loading ? (
        <div className="grid place-items-center min-h-[80vh]">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
        </div>
    ) : (
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Song</h1>
            <form onSubmit={onSubmitHandler} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    {/* Song Upload */}
                    <div className="flex flex-col items-center space-y-2">
                        <p className="text-sm font-medium text-gray-600">Upload Song</p>
                        <input 
                            onChange={(e) => setSong(e.target.files[0])}
                            type="file" 
                            id="song" 
                            accept="audio/*" 
                            hidden 
                        />
                        <label htmlFor="song" className="cursor-pointer">
                            <img 
                                src={song ? assets.upload_added : assets.upload_song} 
                                className="w-24 h-24 border rounded-lg object-cover" 
                                alt="upload_song" 
                            />
                        </label>
                    </div>
                    {/* Image Upload */}
                    <div className="flex flex-col items-center space-y-2">
                        <p className="text-sm font-medium text-gray-600">Upload Image</p>
                        <input 
                            onChange={(e) => setImage(e.target.files[0])} 
                            type="file" 
                            id="image" 
                            accept="image/*" 
                            hidden 
                        />
                        <label htmlFor="image" className="cursor-pointer">
                            <img 
                                src={image ? URL.createObjectURL(image) : assets.upload_area} 
                                className="w-24 h-24 border rounded-lg object-cover" 
                                alt="upload_image" 
                            />
                        </label>
                    </div>
                </div>
    
                {/* Song Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Song Name
                    </label>
                    <input 
                        onChange={(e) => setName(e.target.value)} 
                        value={name} 
                        type="text" 
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" 
                        placeholder="Enter song name" 
                        required 
                    />
                </div>
    
                {/* Song Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Song Description
                    </label>
                    <textarea 
                        onChange={(e) => setDesc(e.target.value)} 
                        value={desc} 
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" 
                        placeholder="Enter description" 
                        rows="3" 
                        required
                    ></textarea>
                </div>
    
                {/* Album Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Album
                    </label>
                    <select 
                        onChange={(e) => setAlbum(e.target.value)} 
                        value={album} 
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                        <option value="none">None</option>
                        {albumData.map((item, index) => (
                            <option key={index} value={item.name}>{item.name}</option>
                        ))}
                    </select>
                </div>
    
                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition duration-200"
                >
                    Add Song
                </button>
            </form>
        </div>
    );
    
}

export default AddSong