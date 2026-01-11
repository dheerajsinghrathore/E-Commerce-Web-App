import toast from "react-hot-toast";

const AxiosToastError = (error) => {
  if (error?.response?.data?.message) {
    toast.error(error.response.data.message);
  } else if (error?.message) {
    toast.error(error.message);
  } else {
    toast.error("Something went wrong. Please check your connection.");
  }
};

export default AxiosToastError;