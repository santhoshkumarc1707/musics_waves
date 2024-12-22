import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import UserPopUp from "./UserPopUp";

const Users = () => {
  const usersRef = useRef(null);
  const token = useSelector((state) => state.auth.token);
  const id = useSelector((state) => state.auth.id);
  const [showModal, setShowModal] = useState(false);
  const [currentTrack, setCurrentTrack] = useState();
  const [usersData, setUsersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const getAllUsers = useCallback(
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
          `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/users?page=${currentPage}&limit=10`,
          config
        );

        setUsersData(response.data?.data || []);
        setTotalPages(response.data?.totalPages || 1);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Error fetching users:", error);
        }
      }
    },
    [token, currentPage]
  );

  const handleDeleteUser = async (id) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/users/${id}`,
        config
      );
      setUsersData((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    usersRef.current = abortController;

    getAllUsers(abortController.signal);

    return () => {
      if (usersRef.current) {
        usersRef.current.abort();
      }
    };
  }, [getAllUsers]);

  const handleUserClick = (user) => {
    setCurrentTrack(user);
   
    
    setShowModal(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const tableHeader = ["ID", "Name", "Email", "Gender", "Role", "Action"];
  return (
    <div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <p className="text-center text-gray-500 py-4">Loading...</p>
        ) : usersData && usersData.length > 0 ? (
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
                {usersData.map((user, idx) => (
                  <tr
                    key={user._id || idx}
                    className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100`}
                     onClick={()=>handleUserClick(user)} 
                  >
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      {user.gender}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      {user.isAdmin ? "Admin" : "User"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          handleDeleteUser(user._id);
                        }}
                        disabled={user.isAdmin || user._id === id}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
                {showModal && (
                  <UserPopUp currentUser={currentTrack} setShowModal={setShowModal} />
                )}
              </tbody>
            </table>
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
          <p className="text-center text-gray-500 py-4">No users found</p>
        )}
      </div>
    </div>
  );
};

export default Users;

