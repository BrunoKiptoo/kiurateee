import { validateApiKey } from "../config/api-key.config";
import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  updateUser,
  deleteAllUsers,
  deleteUser,
  getAllUsers,
  resetPassword,
  resetPasswordWithCode,
  getFollowing,
  getFollowers,
  followUser,
  unfollowUser,
  getUserById,
} from "../controllers/auth.contoller";
import {
  registerValidator,
  loginValidator,
  updateUserValidator,
  resetPasswordValidator,
  resetPasswordWithCodeValidator,
  followUserValidator,
  unfollowUserValidator,
} from "../middlewares/validators/auth.validators";
import { validate } from "../middlewares/validate-request";

const router = Router();

router.post("/register", validateApiKey, registerValidator, validate, register);
router.post("/login", validateApiKey, loginValidator, validate, login);
router.post("/refresh-token", validateApiKey, refreshToken);
router.put("/user/:id", validateApiKey, updateUserValidator, validate, updateUser);
router.delete("/users", validateApiKey, deleteAllUsers);
router.delete("/user/:id", validateApiKey, deleteUser);
router.get("/users", validateApiKey, getAllUsers);
router.get("/users/:id", validateApiKey, getUserById);
router.post("/reset-password", validateApiKey, resetPasswordValidator, validate, resetPassword);
router.post("/reset-password-with-code", validateApiKey, resetPasswordWithCodeValidator, validate, resetPasswordWithCode);
router.post("/follow/:userId", validateApiKey, followUserValidator, validate, followUser);
router.post("/unfollow/:userId", validateApiKey, unfollowUserValidator, validate, unfollowUser);
router.get("/following/:userId", validateApiKey, getFollowing);
router.get("/followers/:userId", validateApiKey, getFollowers);

export default router;
