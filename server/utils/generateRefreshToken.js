import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const generateRefreshToken = async (user) => {
  if (!process.env.SECRET_KEY_REFRESH_TOKEN) {
    throw new Error(
      "SECRET_KEY_REFRESH_TOKEN is not defined in environment variables. Please set it up in .env file"
    );
  }

  const payload = {
    id: user._id,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY_REFRESH_TOKEN, {
    expiresIn: "30d",
  });

  const updateRefreshToken = await UserModel.findByIdAndUpdate(
    user._id,
    { refresh_token: token },
    { new: true }
  );
  return token;
};

export default generateRefreshToken;
