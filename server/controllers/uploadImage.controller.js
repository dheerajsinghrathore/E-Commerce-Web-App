import uploadCloudinaryImage from "../utils/uploadCloudinaryImage.js";

const uploadImageController = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                message: "No file uploaded",
                error: true,
                success: false,
            });
        }

        const uploadResult = await uploadCloudinaryImage(file);

        res.status(200).json({
            message: "Image uploaded successfully",
            imageUrl: uploadResult.secure_url || uploadResult.url,
            error: false,
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message || "Server error",
            error: true,
            success: false,
        });
    }
};

export default uploadImageController;