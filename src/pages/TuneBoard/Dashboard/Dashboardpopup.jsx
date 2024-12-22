import React from 'react'


const Dashboardpopup = ({currentTrack,setShowModal}) => {
  
    
  return (
    <div>Dashboardpopup
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-xl font-semibold mb-4">Track Details</h2>
              <p className="mb-2">Track ID: {currentTrack?._id}</p>
              <p className="mb-2">Track Name: {currentTrack?.name}</p>
              {currentTrack?.songs?.map((curr, idx) => (
                <p className="mb-2" key={idx}>
                  Track songs {curr}
                </p>
              ))}
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div> 
          </div>
    </div>
  )
}

export default Dashboardpopup