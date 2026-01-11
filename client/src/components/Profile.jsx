import React from "react";
import { useSelector } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileEdit from "./UserProfileEdit";

function Profile() {
  const user = useSelector((state) => state.user);
  const [openEdit, setOpenEdit] = React.useState(false);
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="flex items-center space-x-4">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <FaRegUserCircle className="text-4xl text-gray-500 rounded-full overflow-hidden" />
        )}
        <div>
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      <button
        onClick={() => setOpenEdit(true)}
        className="cursor-pointer mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition"
      >
        Edit Profile
      </button>

      {openEdit && <UserProfileEdit closeEdit={() => setOpenEdit(false)} />}
    </div>
  );
}

export default Profile;
