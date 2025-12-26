import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  if (!process.env.SECRET_KEY_ACCESS_TOKEN) {
    throw new Error(
      "SECRET_KEY_ACCESS_TOKEN is not defined in environment variables. Please set it up in .env file"
    );
  }

  const payload = {
    id: user._id,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY_ACCESS_TOKEN, {
    expiresIn: "1h",
  });

  return token;
};

export default generateAccessToken;
