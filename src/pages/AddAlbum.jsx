import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/admin-assets/assets";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AddAlbum() {
    const [image, setImage] = useState(null);
    const [colour, setColour] = useState("#121212");
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [loading, setLoading] = useState(false);

    const token = useSelector((state) => state.auth?.token);
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error("Authentication token is missing.");
            return;
        }

        setLoading(true);

        try {
            const config = {
                headers: {
                    "x-auth-token": token,
                },
            };

            const formData = new FormData();
            formData.append("name", name);
            formData.append("desc", desc);
            formData.append("image", image);
            formData.append("bgColour", colour);

            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/album/add`,
                formData,
                config
            );

            if (response.data.success) {
                toast.success("Album Added Successfully!");
                navigate("/list-album");
                resetForm();
            } else {
                toast.error(response.data.message || "Failed to add album.");
            }
        } catch (error) {
            console.error("Error adding album:", error);
            toast.error(error.response?.data?.message || "An error occurred while adding the album.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName("");
        setDesc("");
        setColour("#121212");
        setImage(null);
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Album</h1>
            {loading ? (
                <div className="grid place-items-center min-h-[80vh]">
                    <div className="w-16 h-16 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <form onSubmit={onSubmitHandler} className="space-y-6">
                    {/* Upload Image */}
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-sm font-medium text-gray-600">Upload Image</p>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            hidden
                        />
                        <label htmlFor="image" className="cursor-pointer">
                            <img
                                src={image ? URL.createObjectURL(image) : assets.upload_area}
                                className="w-24 h-24 border rounded-lg object-cover"
                                alt="Upload Preview"
                            />
                        </label>
                    </div>

                    {/* Album Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Album Name</label>
                        <input
                            type="text"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            placeholder="Enter album name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Album Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Album Description</label>
                        <textarea
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            placeholder="Enter description"
                            rows="3"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    {/* Background Colour */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Background Colour</label>
                        <input
                            type="color"
                            className="w-15 h-10 p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            value={colour}
                            onChange={(e) => setColour(e.target.value)}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full py-3 font-medium rounded-lg transition duration-200 ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Album"}
                    </button>
                </form>
            )}
        </div>
    );
}

export default AddAlbum;
