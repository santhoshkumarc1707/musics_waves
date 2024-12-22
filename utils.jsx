

export  const roleBasedTabs = {
  admin: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "User", path: "/user" },
    { name: "Song", path: "/list-song" },
    { name: "Playlist", path: "/list-album" },
  ],
  user: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "ListSongs", path: "/songs" ,}
   
  ],
  default:[{name:"",path:""}]

};
export const getTabNameByPath = (pathname, role = "default") => {
  // Check if the role exists in roleBasedTabs
  const tabs = roleBasedTabs[role] || roleBasedTabs.default;

  // Find the matching tab
  const match = tabs.find((tab) => tab.path === pathname);

  // Return the tab name or fallback to default
  return match ? match.name : "";
};


import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
