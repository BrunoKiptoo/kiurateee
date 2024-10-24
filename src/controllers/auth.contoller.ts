import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/user.model";
import { JWT_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../config/env";
import Logger from "../utils/logger";
import { IMetadata } from "../interface/interfaces";
import { sendSms } from "../utils/sms";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import mongoose, { ObjectId } from "mongoose";

// Middleware to handle file upload

// Cloudinary configuration (add your own credentials)
cloudinary.config({
  cloud_name: "dnhxfev5e",
  api_key: "851242487181562",
  api_secret: "wAwyHEnwZPiLGHaW7s1E8HjIJg0",
});

const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    Logger.error("Validation error on registration: " + JSON.stringify(errors.array()));
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, mobileNumber, password, tag } = req.body;
  const avatar = req.file;

  try {
    // Check if the tag already exists
    let user = await User.findOne({ tag });
    if (user) {
      Logger.info(`User with tag ${tag} already exists.`);
      return res.status(400).json({ msg: "User with this tag already exists" });
    }

    // Check if the mobile number already exists
    user = await User.findOne({ mobileNumber });
    if (user) {
      Logger.info(`User with mobile number ${mobileNumber} already exists.`);
      return res.status(400).json({ msg: "User with this mobile number already exists" });
    }

    // Upload avatar image to Cloudinary if it exists
    let profile_picture = null;
    if (avatar) {
      const myCloud = await cloudinary.uploader.upload(avatar.path, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      profile_picture = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    user = new User({ name, mobileNumber, password, tag, profile_picture });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

    Logger.info(`User ${name} registered successfully.`);

    // Set cookies
    res.cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 15 }); // 15 minutes
    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }); // 7 days

    res.json({
      msg: "User registered successfully",
      user: { id: user.id, name: user.name, mobileNumber: user.mobileNumber, tag: user.tag, profile_picture: user.profile_picture },
    });
  } catch (err) {
    Logger.error(`Server error on registration: ${err.message}`);
    res.status(500).send("Server error");
  }
};

const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    Logger.error("Validation error on login: " + JSON.stringify(errors.array()));
    return res.status(400).json({ errors: errors.array() });
  }

  const { mobileNumber, password } = req.body;

  try {
    // Find the user by mobile number
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      Logger.info(`Invalid credentials for mobile number: ${mobileNumber}`);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      Logger.info(`Invalid password for mobile number: ${mobileNumber}`);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT tokens
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

    Logger.info(`User with mobile number ${mobileNumber} logged in successfully.`);

    // Set cookies
    res.cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 15 }); // 15 minutes
    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }); // 7 days

    res.json({
      msg: "Login successful",
      user: { id: user.id, name: user.name, mobileNumber: user.mobileNumber, tag: user.tag },
    });
  } catch (err) {
    Logger.error(`Server error on login: ${err.message}`);
    res.status(500).send("Server error");
  }
};

const refreshToken = (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    Logger.info("No token provided for refresh token.");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const newPayload = { user: { id: payload.user.id } };

    const newToken = jwt.sign(newPayload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const newRefreshToken = jwt.sign(newPayload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

    Logger.info(`Token refreshed for user ID: ${payload.user.id}`);

    // Set cookies
    res.cookie("token", newToken, { httpOnly: true, maxAge: 1000 * 60 * 15 }); // 15 minutes
    res.cookie("refreshToken", newRefreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }); // 7 days

    res.json({ msg: "Token refreshed" });
  } catch (err) {
    Logger.error(`Invalid token for refresh: ${err.message}`);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

const generateResetCode = () => {
  return crypto.randomInt(10000, 99999); // Generates a 5-digit code
};

const resetPassword = async (req: Request, res: Response) => {
  const { mobileNumber } = req.body;

  // Validate input
  if (!mobileNumber) {
    return res.status(400).json({ msg: "Mobile number is required" });
  }

  try {
    // Find user by mobile number
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      Logger.info(`User with mobile number ${mobileNumber} not found.`);
      return res.status(404).json({ msg: "User not found" });
    }

    // Generate a 5-digit reset code
    const resetCode = generateResetCode();

    // Save the reset code to the user's record
    user.resetCode = resetCode;
    await user.save();

    // Send the reset code to the user's mobile number
    await sendSms(mobileNumber, `Your password reset code is: ${resetCode}`);

    Logger.info(`Password reset code sent to user with mobile number ${mobileNumber}.`);
    res.json({ msg: "Password reset code sent to your mobile number" });
  } catch (err) {
    Logger.error(`Server error on password reset: ${err.message}`);
    res.status(500).send("Server error");
  }
};

const resetPasswordWithCode = async (req: Request, res: Response) => {
  const { mobileNumber, resetCode, newPassword, confirmPassword } = req.body;

  // Validate input
  if (!mobileNumber || !resetCode || !newPassword || !confirmPassword) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ msg: "New password and confirmation do not match" });
  }

  try {
    // Find user by mobile number
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      Logger.info(`User with mobile number ${mobileNumber} not found.`);
      return res.status(404).json({ msg: "User not found" });
    }

    // Verify the reset code
    if (user.resetCode !== parseInt(resetCode, 10)) {
      Logger.info(`Invalid reset code for mobile number ${mobileNumber}.`);
      return res.status(400).json({ msg: "Invalid reset code" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the user's password and clear the reset code
    user.password = hashedPassword;
    user.resetCode = undefined; // Clear the reset code
    await user.save();

    Logger.info(`Password successfully reset for user with mobile number ${mobileNumber}.`);
    res.json({ msg: "Password successfully reset" });
  } catch (err) {
    Logger.error(`Server error on password reset: ${err.message}`);
    res.status(500).send("Server error");
  }
};

// Update user info
const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params; // User ID from route params
  const { name, mobileNumber, password, tag, profile_picture } = req.body;

  // Validate incoming request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    Logger.error("Validation error on updating user: " + JSON.stringify(errors.array()));
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      Logger.info(`User with ID ${id} not found.`);
      return res.status(404).json({ msg: "User not found" });
    }

    // Update user details
    if (name) user.name = name;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (tag) user.tag = tag;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    if (profile_picture) user.profile_picture = profile_picture;

    await user.save();

    Logger.info(`User with ID ${id} updated successfully.`);
    res.json({ msg: "User updated successfully", user });
  } catch (err) {
    Logger.error(`Server error on updating user: ${err.message}`);
    res.status(500).send("Server error");
  }
};

// Delete all users
const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    console.log(req);
    await User.deleteMany({});
    Logger.info("All users deleted.");
    res.json({ msg: "All users deleted" });
  } catch (err) {
    Logger.error(`Server error on deleting all users: ${err.message}`);
    res.status(500).send("Server error");
  }
};

// Delete a single user
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      Logger.info(`User with ID ${id} not found.`);
      return res.status(404).json({ msg: "User not found" });
    }

    await User.findByIdAndDelete(id);
    Logger.info(`User with ID ${id} deleted.`);
    res.json({ msg: "User deleted" });
  } catch (err) {
    Logger.error(`Server error on deleting user: ${err.message}`);
    res.status(500).send("Server error");
  }
};

// Get all users with metadata
const getAllUsers = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, tag, name } = req.query;

  const query: any = {};

  if (tag) {
    query.tag = new RegExp(tag as string, "i");
  }

  if (name) {
    query.name = new RegExp(name as string, "i");
  }

  try {
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const metadata: IMetadata = {
      total,
      current_page: Number(page),
      has_next_page: Number(page) * Number(limit) < total,
      has_previous_page: Number(page) > 1,
      next_page: Number(page) * Number(limit) < total ? Number(page) + 1 : null,
      previous_page: Number(page) > 1 ? Number(page) - 1 : null,
      last_page: Math.ceil(total / Number(limit)),
    };

    res.json({ users, metadata });
  } catch (err) {
    Logger.error(`Server error on fetching users: ${err.message}`);
    res.status(500).send("Server error");
  }
};
const followUser = async (req: Request, res: Response) => {
  const { userIdToFollow } = req.body;
  const { userId } = req.params;

  try {
    Logger.info(`Follow request initiated: User ${userId} wants to follow User ${userIdToFollow}`);

    // Ensure both user IDs are valid ObjectId instances
    if (!mongoose.Types.ObjectId.isValid(userIdToFollow) || !mongoose.Types.ObjectId.isValid(userId)) {
      Logger.warn(`Invalid user IDs: userIdToFollow: ${userIdToFollow}, userId: ${userId}`);
      return res.status(400).json({ message: "Invalid user IDs" });
    }

    // Fetch both users
    const userToFollow = await User.findById(userIdToFollow);
    const currentUser = await User.findById(userId);

    // Check if the users exist
    if (!userToFollow || !currentUser) {
      Logger.warn(`User not found: userIdToFollow: ${userIdToFollow}, userId: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent self-follow
    if (userId === userIdToFollow) {
      Logger.warn(`User ${userId} attempted to follow themselves.`);
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Check if already following
    const isAlreadyFollowing = currentUser.following.some((id) => String(id) === String(userToFollow._id));
    if (isAlreadyFollowing) {
      Logger.warn(`User ${userId} is already following User ${userIdToFollow}`);
      return res.status(400).json({ message: "Already following this user" });
    }

    // Add to following and followers
    currentUser.following.push(userToFollow._id as ObjectId);
    userToFollow.followers.push(currentUser._id as ObjectId);

    // Save both users
    await currentUser.save();
    await userToFollow.save();

    Logger.info(`User ${userId} successfully followed User ${userIdToFollow}`);
    return res.status(200).json({ message: "Successfully followed the user" });
  } catch (error) {
    Logger.error(`Error while following user: ${error.message}`);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const unfollowUser = async (req: Request, res: Response) => {
  const { userIdToUnfollow } = req.body; // The user to unfollow
  const { userId } = req.params; // The current user

  try {
    Logger.info(`Unfollow request initiated: User ${userId} wants to unfollow User ${userIdToUnfollow}`);

    // Ensure both user IDs are valid ObjectId instances
    if (!mongoose.Types.ObjectId.isValid(userIdToUnfollow) || !mongoose.Types.ObjectId.isValid(userId)) {
      Logger.warn(`Invalid user IDs: userIdToUnfollow: ${userIdToUnfollow}, userId: ${userId}`);
      return res.status(400).json({ message: "Invalid user IDs" });
    }

    // Fetch both users
    const userToUnfollow = await User.findById(userIdToUnfollow);
    const currentUser = await User.findById(userId);

    // Check if the users exist
    if (!userToUnfollow || !currentUser) {
      Logger.warn(`User not found: userIdToUnfollow: ${userIdToUnfollow}, userId: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent self-unfollow
    if (userId === userIdToUnfollow) {
      Logger.warn(`User ${userId} attempted to unfollow themselves.`);
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    // Check if the user is actually following the other user
    const isFollowing = currentUser.following.some((id) => String(id) === String(userToUnfollow._id));
    if (!isFollowing) {
      Logger.warn(`User ${userId} is not following User ${userIdToUnfollow}`);
      return res.status(400).json({ message: "You are not following this user" });
    }

    // Remove the user from following and followers lists
    currentUser.following = currentUser.following.filter((id) => String(id) !== String(userToUnfollow._id));
    userToUnfollow.followers = userToUnfollow.followers.filter((id) => String(id) !== String(currentUser._id));

    // Save both users
    await currentUser.save();
    await userToUnfollow.save();

    Logger.info(`User ${userId} successfully unfollowed User ${userIdToUnfollow}`);
    return res.status(200).json({ message: "Successfully unfollowed the user" });
  } catch (error) {
    Logger.error(`Error while unfollowing user: ${error.message}`);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getFollowing = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { page = 1, limit = 10, search } = req.query;

  try {
    Logger.info(`Fetching following users for User ID: ${userId}, Page: ${page}, Limit: ${limit}, Search: ${search}`);

    const user = await User.findById(userId).populate({
      path: "following",
      select: "name tag",
      match: search
        ? {
            $or: [{ name: new RegExp(search as string, "i") }, { tag: new RegExp(search as string, "i") }],
          }
        : {},
      options: {
        skip: (Number(page) - 1) * Number(limit),
        limit: Number(limit),
      },
    });

    if (!user) {
      Logger.warn(`User not found: User ID: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    const total = user.following.length;
    const metadata: IMetadata = {
      total,
      current_page: Number(page),
      has_next_page: Number(page) * Number(limit) < total,
      has_previous_page: Number(page) > 1,
      next_page: Number(page) * Number(limit) < total ? Number(page) + 1 : null,
      previous_page: Number(page) > 1 ? Number(page) - 1 : null,
      last_page: Math.ceil(total / Number(limit)),
    };

    Logger.info(`Successfully fetched following users for User ID: ${userId}`);
    res.status(200).json({ following: user.following, metadata });
  } catch (error) {
    Logger.error(`Server error on fetching following users: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message || error });
  }
};

const getFollowers = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { page = 1, limit = 10, search } = req.query;

  try {
    Logger.info(`Fetching followers for User ID: ${userId}, Page: ${page}, Limit: ${limit}, Search: ${search}`);

    const user = await User.findById(userId).populate({
      path: "followers",
      select: "name tag",
      match: search
        ? {
            $or: [{ name: new RegExp(search as string, "i") }, { tag: new RegExp(search as string, "i") }],
          }
        : {},
      options: {
        skip: (Number(page) - 1) * Number(limit),
        limit: Number(limit),
      },
    });

    if (!user) {
      Logger.warn(`User not found: User ID: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    const total = user.followers.length;
    const metadata: IMetadata = {
      total,
      current_page: Number(page),
      has_next_page: Number(page) * Number(limit) < total,
      has_previous_page: Number(page) > 1,
      next_page: Number(page) * Number(limit) < total ? Number(page) + 1 : null,
      previous_page: Number(page) > 1 ? Number(page) - 1 : null,
      last_page: Math.ceil(total / Number(limit)),
    };

    Logger.info(`Successfully fetched followers for User ID: ${userId}`);
    res.status(200).json({ followers: user.followers, metadata });
  } catch (error) {
    Logger.error(`Server error on fetching followers: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message || error });
  }
};

export {
  register,
  getFollowers,
  getFollowing,
  unfollowUser,
  followUser,
  login,
  resetPassword,
  refreshToken,
  updateUser,
  deleteAllUsers,
  deleteUser,
  getAllUsers,
  resetPasswordWithCode,
};
