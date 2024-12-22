import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Auth Pages
import Login from "../pages/Auth/Login/Login";
import Signup from "../pages/Auth/Signup/Signup";

// Dashboard Layout and Pages
import DashbordLayout from "../pages/TuneBoard/DasboardLayout/DashbordLayout";
import Dashboard from "../pages/TuneBoard/Dashboard/Dashboard";

// Songs Pages
import CreateSongs from "../pages/TuneBoard/Song/createSongs";
import EditSongs from "../pages/TuneBoard/Song/Editsongs";
import Songs from "../pages/TuneBoard/Song/Songs";
import ViewSongs from "../pages/TuneBoard/Song/ViewSongs";

// Users Page
import Users from "../pages/TuneBoard/Users/Users";

// Playlist Pages
import Playlist from "../pages/TuneBoard/Playlist/Playlist";
import CreatePlaylist from "../pages/TuneBoard/Playlist/Create";
import ViewPlaylist from "../pages/TuneBoard/Playlist/view";
import EditPlaylist from "../pages/TuneBoard/Playlist/edit";
import Togglesong from "../pages/TuneBoard/Playlist/Togglesong";

// Other Pages
import AddSong from "../pages/AddSong";
import AddAlbum from "../pages/AddAlbum";
import ListSong from "../pages/ListSong";
import ListAlbum from "../pages/ListAlbum";

const AppRouter = () => {
  const { token, user } = useSelector((state) => state.auth);

  const isLoggedIn = !!token; // Check login status
  const isAdmin = user; // Use 'user' for admin check logic

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/sign-up"
        element={isLoggedIn ? <Navigate to="/dashboard" /> : <Signup />}
      />

      {/* Protected Routes */}
      <Route element={isLoggedIn ? <DashbordLayout /> : <Navigate to="/" />}>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin Routes */}
        {isAdmin ? (
          <>
            <Route path="/songs">
              <Route index element={<Songs />} />
              <Route path="create" element={<CreateSongs />} />
              <Route path="edit/:id" element={<EditSongs />} />
              <Route path="view/:id" element={<ViewSongs />} />
            </Route>
            <Route path="user" element={<Users />} />
            <Route path="/add-song" element={<AddSong />} />
            <Route path="/add-album" element={<AddAlbum />} />
            <Route path="/list-song" element={<ListSong />} />
            <Route path="/list-album" element={<ListAlbum />} />
          </>
        ) : (
          <>
            {/* User-Specific Routes */}
            <Route path="/users">
              <Route index element={<>User Dashboard</>} />
              <Route path="profile" element={<>User Profile</>} />
            
            </Route>
          </>
        )}

        {/* Shared Routes */}
        <Route path="/playlist">
          <Route index element={<Playlist />} />
          <Route path="create-playlist" element={<CreatePlaylist />} />
          <Route path="edit/:id" element={<EditPlaylist />} />
          <Route path="view/:id" element={<ViewPlaylist />} />
          <Route path="edit/:id/addsongs" element={<Togglesong />} />
          <Route path="add-songs" element={<>Add Songs</>} />
        </Route>
        <Route path="/get-songs" element={<Songs />} />
        <Route path="/get-favorites" element={<>Favorites</>} />
      <Route path="/songs" element={<>hi</>}/>
      </Route>

      {/* Catch-All Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;
