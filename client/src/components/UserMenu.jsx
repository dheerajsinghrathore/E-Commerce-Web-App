import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import { HiOutlineLogout } from "react-icons/hi";
import { FiBox, FiMapPin } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/userSlice";
import AxiosApi from "../common/AxiosApi";
import CustomAxios from "../utils/CustomAxios";
import toast from "react-hot-toast";
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from "../utils/isAdmin";

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
        navigate("/login", { replace: true });
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
      <Link
        to="/dashboard/profile"
        onClick={handleLinkClick}
        className="px-4 pb-3 block hover:bg-primary-50 transition-all group"
      >
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-neutral-800 text-base group-hover:text-primary-400">
            My Account
          </h2>
          {isAdmin(user) && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Admin</span>
          )}
        </div>
        <p
          className="text-xs text-neutral-500 truncate flex items-center gap-2"
          title={user.email}
        >
          <span className="group-hover:text-neutral-700">
            {user.name || user.mobile || user.email}
          </span>
          <HiOutlineExternalLink
            size={15}
            className="group-hover:text-primary-400 transition-colors"
          />
        </p>
      </Link>

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
