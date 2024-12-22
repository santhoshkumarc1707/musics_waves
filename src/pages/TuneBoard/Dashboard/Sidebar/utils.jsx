import { useSelector } from "react-redux";
import { useMemo } from "react";

export const tabs = useMemo(() => {
  const user = useSelector((state) => state.auth.user);
  const userTabs = {
    admin: ["Dashboard", "Service Provider", "PTW Question"],
    user: ["Dashboard", "Documents"],
  };
  return userTabs[user] || [];
}, [user]);

export const validPaths = useMemo(
  () => tabs.map((tab) => `/${tab.toLowerCase().replace(/\s+/g, "-")}`),
  [tabs]
);

