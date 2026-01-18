import React from "react";
import { useSelector } from "react-redux";

function AdminPermission({ children }) {
  const user = useSelector((state) => state.user);

  if (user.loading) {
    return <div className="p-4">Loading permission...</div>;
  }

  if (user?.role !== "admin") {
    return <div className="text-red-500 font-bold p-4">You do not have permission to access this page.</div>;
  }
  return <>{children}</>;
}

export default AdminPermission;
