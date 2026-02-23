import { authServices } from "../services/authServices.js";

// Login
export const loginController = async (req, res, next) => {
  try {
    const { user, token } = await authServices.login(req.body);

    res.status(200).json({
      valid: true,
      data: user,
      token: token,
    });
  } catch (err) {
    next(err);
  }
};
