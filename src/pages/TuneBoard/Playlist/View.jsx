import React from 'react'
import { useNavigate } from 'react-router-dom'

const ViewPlaylist = () => {
  const navigate=useNavigate();
  return (
    <div>
      <div className="px-4 py-2">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
        >
          Back
        </button>
      </div>
    </div>
  )
}

export default ViewPlaylist