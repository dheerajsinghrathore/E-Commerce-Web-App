import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  const token =
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({
      message: "Access denied. No token provided.",
      error: true,
      success: false,
    });
  }

  if (!process.env.SECRET_KEY_ACCESS_TOKEN) {
    return res.status(500).json({
      message: "Server configuration error. Please contact administrator.",
      error: true,
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({
      message: "Invalid or expired token.",
      error: true,
      success: false,
    });
  }
};

export default auth;
