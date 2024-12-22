import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { fetchUserById, clearError } from "../../../store/profileSlice";
import Sidebar from "../Dashboard/Sidebar/Sidebar";
import { getTabNameByPath } from "../../../../utils";

const DashboardLayout = () => {
  const dispatch = useDispatch();
 const id = useSelector((state) => state.auth?.id);
  const token = useSelector((state) => state.auth?.token);


  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (id && token) {
      dispatch(fetchUserById({ id, token }));
    }
  }, [id, token, dispatch]);


  const currentPath = window.location.pathname;
const user=useSelector((state)=>state.auth?.user);
const userRole=user?"admin":"user";
 
  const currentTabName = getTabNameByPath(currentPath, userRole);


  return (
    <div className="flex h-screen bg-gray-100 sm:grid sm:grid-cols-[auto,1fr]">
  <aside className="w-full sm:w-64 bg-white p-4 border-r border-gray-300 shadow-md sm:h-screen">
    <Sidebar />
  </aside>
  <div className="flex-1 flex flex-col">
    {/* Header */}
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sm:w-full">
      <h1 className="text-xl font-semibold">{currentTabName}</h1>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search for Songs, Artists and Playlists"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-2/3"
        />
        <img
          src="https://via.placeholder.com/40"
          alt="User Avatar"
          className="rounded-full w-10 h-10"
        />
      </div>
    </header>
    {/* Content Area */}
    <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
      <Outlet />
    </div>

    {/* Footer */}
    <footer className="h-10 bg-gray-200 text-gray-600 flex items-center justify-center text-sm">
      © 2024 WavesMusic. All rights reserved.
    </footer>
  </div>
</div>

  );
};

export default DashboardLayout;

