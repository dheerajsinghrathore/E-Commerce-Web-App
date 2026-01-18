import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const user = useSelector((state) => state.user);

    if (user.loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!user?._id) {
        return <Navigate to="/login" replace={true} />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;
