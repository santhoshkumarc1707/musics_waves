import  { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../../store/authSlice";
import Swal from "sweetalert2";
import { roleBasedTabs } from "../../../../../utils";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: profileUser } = useSelector((state) => state.profile || {});
  const user = useSelector((state) => state.auth.user);

  const users = user ? "admin" : "user";

  const tabs = useMemo(() => roleBasedTabs[users] || roleBasedTabs.default, [users]);

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to logout?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, logout!",
        cancelButtonText: "No, stay logged in",
      });

      if (result.isConfirmed) {
        dispatch(logout());
        localStorage.removeItem("authToken");
        sessionStorage.clear(); // Optional
        navigate("/");

        Swal.fire({
          title: "Logged out",
          text: "You have been logged out successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <img
          className="w-16 h-16 rounded-full mx-auto"
          src={`https://picsum.photos/id/${Math.floor(
            Math.random() * 1000
          )}/200/300`}
          alt="User"
        />
        <h2 className="text-lg font-semibold mt-2">
          {profileUser?.data?.name || "Default User"}
        </h2>
        <p className="text-gray-500">
          {profileUser?.data?.email || "user@example.com"}
        </p>
      </div>
      <nav>
        <ul className="space-y-4">
          {tabs.map((tab) => (
            <li
              key={tab.name}
              className="text-gray-600 hover:text-purple-600 capitalize transition duration-150"
            >
              <Link to={tab.path}>{tab.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <button
        className="mt-10 w-full bg-purple-500 text-white py-2 rounded-lg"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
