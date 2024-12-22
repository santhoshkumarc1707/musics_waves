import React from 'react'
import ToggleSongButton from '../../../Components/TogglesongButton/TogglesongButton'
import { useNavigate, useParams } from 'react-router-dom'

const Togglesong = () => {
    const navigate = useNavigate();
    const {id}=useParams();
    return (
        <div>
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-6 w-24 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
            >
                Back
            </button>

            <ToggleSongButton playlistId={id} songId={"674d63d250ddf5d72a2849e8"} />
        </div>
    )
}

export default Togglesong