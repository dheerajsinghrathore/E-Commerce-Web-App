import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import fetchUserDetails from "./utils/fetchUserDetails";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserDetails, setLoading } from "./store/userSlice";

function App() {
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        dispatch(setLoading(false));
        return;
      }

      const userData = await fetchUserDetails();
      if (userData?.success) {
        dispatch(setUserDetails(userData.data));
      } else {
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.log("App.jsx fetchUser error", error);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-[80vh]">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </>
  );
}

export default App;
