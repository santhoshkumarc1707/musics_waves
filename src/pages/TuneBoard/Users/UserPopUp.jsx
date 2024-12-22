
const UserPopUp = ({currentUser, setShowModal, error }) => {
console.log(currentUser);

    return (
        <div>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 w-96">
                    <h2 className="text-xl font-semibold mb-4">User Details</h2>
                    <p className="mb-2">Name: {currentUser?.name}</p>
                    <p className="mb-2">Email: {currentUser?.email}</p>
                    <p className="mb-2">Gender: {currentUser?.gender}</p>
                    <p className="mb-2">Date of Birth: {currentUser?.date} {currentUser?.month}, {currentUser?.year}</p>
                    <p className="mb-2">Admin: {currentUser?.isAdmin ? "Yes" : "No"}</p>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
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
export default UserPopUp

