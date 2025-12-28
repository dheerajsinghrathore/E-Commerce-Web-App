import AxiosApi from "../common/AxiosApi";
import CustomAxios from "./CustomAxios";

const fetchUserDetails = async () => {
  try {
    const response = await CustomAxios({
      ...AxiosApi.user_details,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default fetchUserDetails;
