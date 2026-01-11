import AxiosApi from "../common/AxiosApi";
import CustomAxios from "./CustomAxios";

const uploadImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append("image", file);
        const response = await CustomAxios.post(AxiosApi.upload_image.url, formData);
        return response.data.imageUrl;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default uploadImage;
