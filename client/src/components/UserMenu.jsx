import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import { HiOutlineLogout } from "react-icons/hi";
import { FiBox, FiMapPin } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/userSlice";
import AxiosApi from "../common/AxiosApi";
import CustomAxios from "../utils/CustomAxios";
import toast from "react-hot-toast";

function UserMenu({ close }) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await CustomAxios({
        ...AxiosApi.logout,
      });

      if (response.data.success) {
        localStorage.clear();
        dispatch(logout());
        if (close) close();
        navigate("/login");
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      // Even if API fails, we should still log out locally for better UX
      // localStorage.clear();
      // dispatch(logout());
      // if (close) close();
      // navigate("/login");
    }
  };

  const handleLinkClick = () => {
    if (close) close();
  };

  return (
    <div className="py-2">
      <div className="px-4 pb-2">
        <p className="font-bold text-neutral-800 text-base">My Account</p>
        <p className="text-xs text-neutral-500 truncate" title={user.email}>
          {user.name || user.mobile || user.email}
        </p>
      </div>

      <Divider />

      <div className="px-1 py-1 grid">
        <Link
          to={"/dashboard/my-orders"}
          onClick={handleLinkClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-primary-50 text-neutral-600 hover:text-primary-400 transition-all font-medium text-sm"
        >
          <FiBox size={18} />
          <span>My Orders</span>
        </Link>

        <Link
          to={"/dashboard/address"}
          onClick={handleLinkClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-primary-50 text-neutral-600 hover:text-primary-400 transition-all font-medium text-sm"
        >
          <FiMapPin size={18} />
          <span>Saved Addresses</span>
        </Link>
      </div>

      <Divider />

      <div className="px-1 py-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-red-50 text-red-500 transition-all font-medium text-sm text-left"
        >
          <HiOutlineLogout size={18} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}

export default UserMenu;
