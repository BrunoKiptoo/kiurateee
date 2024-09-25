"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordWithCode = exports.getAllUsers = exports.deleteUser = exports.deleteAllUsers = exports.updateUser = exports.refreshToken = exports.resetPassword = exports.login = exports.followUser = exports.unfollowUser = exports.getFollowing = exports.getFollowers = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("../models/user.model"));
const env_1 = require("../config/env");
const logger_1 = __importDefault(require("../utils/logger"));
const sms_1 = require("../utils/sms");
const crypto_1 = __importDefault(require("crypto"));
const cloudinary_1 = require("cloudinary");
const mongoose_1 = __importDefault(require("mongoose"));
// Middleware to handle file upload
// Cloudinary configuration (add your own credentials)
cloudinary_1.v2.config({
    cloud_name: "dnhxfev5e",
    api_key: "851242487181562",
    api_secret: "wAwyHEnwZPiLGHaW7s1E8HjIJg0",
});
const register = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        logger_1.default.error("Validation error on registration: " + JSON.stringify(errors.array()));
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, mobileNumber, password, tag } = req.body;
    const avatar = req.file;
    try {
        // Check if the tag already exists
        let user = await user_model_1.default.findOne({ tag });
        if (user) {
            logger_1.default.info(`User with tag ${tag} already exists.`);
            return res.status(400).json({ msg: "User with this tag already exists" });
        }
        // Check if the mobile number already exists
        user = await user_model_1.default.findOne({ mobileNumber });
        if (user) {
            logger_1.default.info(`User with mobile number ${mobileNumber} already exists.`);
            return res.status(400).json({ msg: "User with this mobile number already exists" });
        }
        // Upload avatar image to Cloudinary if it exists
        let profile_picture = null;
        if (avatar) {
            const myCloud = await cloudinary_1.v2.uploader.upload(avatar.path, {
                folder: "avatars",
                width: 150,
                crop: "scale",
            });
            profile_picture = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        user = new user_model_1.default({ name, mobileNumber, password, tag, profile_picture });
        const salt = await bcryptjs_1.default.genSalt(10);
        user.password = await bcryptjs_1.default.hash(password, salt);
        await user.save();
        const payload = { user: { id: user.id } };
        const token = jsonwebtoken_1.default.sign(payload, env_1.JWT_SECRET, { expiresIn: env_1.ACCESS_TOKEN_EXPIRY });
        const refreshToken = jsonwebtoken_1.default.sign(payload, env_1.JWT_SECRET, { expiresIn: env_1.REFRESH_TOKEN_EXPIRY });
        logger_1.default.info(`User ${name} registered successfully.`);
        // Set cookies
        res.cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 15 }); // 15 minutes
        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }); // 7 days
        res.json({
            msg: "User registered successfully",
            user: { id: user.id, name: user.name, mobileNumber: user.mobileNumber, tag: user.tag, profile_picture: user.profile_picture },
        });
    }
    catch (err) {
        logger_1.default.error(`Server error on registration: ${err.message}`);
        res.status(500).send("Server error");
    }
};
exports.register = register;
const login = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        logger_1.default.error("Validation error on login: " + JSON.stringify(errors.array()));
        return res.status(400).json({ errors: errors.array() });
    }
    const { mobileNumber, password } = req.body;
    try {
        // Find the user by mobile number
        const user = await user_model_1.default.findOne({ mobileNumber });
        if (!user) {
            logger_1.default.info(`Invalid credentials for mobile number: ${mobileNumber}`);
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        // Check password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            logger_1.default.info(`Invalid password for mobile number: ${mobileNumber}`);
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        // Generate JWT tokens
        const payload = { user: { id: user.id } };
        const token = jsonwebtoken_1.default.sign(payload, env_1.JWT_SECRET, { expiresIn: env_1.ACCESS_TOKEN_EXPIRY });
        const refreshToken = jsonwebtoken_1.default.sign(payload, env_1.JWT_SECRET, { expiresIn: env_1.REFRESH_TOKEN_EXPIRY });
        logger_1.default.info(`User with mobile number ${mobileNumber} logged in successfully.`);
        // Set cookies
        res.cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 15 }); // 15 minutes
        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }); // 7 days
        res.json({
            msg: "Login successful",
            user: { id: user.id, name: user.name, mobileNumber: user.mobileNumber, tag: user.tag },
        });
    }
    catch (err) {
        logger_1.default.error(`Server error on login: ${err.message}`);
        res.status(500).send("Server error");
    }
};
exports.login = login;
const refreshToken = (req, res) => {
    const { token } = req.body;
    if (!token) {
        logger_1.default.info("No token provided for refresh token.");
        return res.status(401).json({ msg: "No token, authorization denied" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
        const newPayload = { user: { id: payload.user.id } };
        const newToken = jsonwebtoken_1.default.sign(newPayload, env_1.JWT_SECRET, { expiresIn: env_1.ACCESS_TOKEN_EXPIRY });
        const newRefreshToken = jsonwebtoken_1.default.sign(newPayload, env_1.JWT_SECRET, { expiresIn: env_1.REFRESH_TOKEN_EXPIRY });
        logger_1.default.info(`Token refreshed for user ID: ${payload.user.id}`);
        // Set cookies
        res.cookie("token", newToken, { httpOnly: true, maxAge: 1000 * 60 * 15 }); // 15 minutes
        res.cookie("refreshToken", newRefreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }); // 7 days
        res.json({ msg: "Token refreshed" });
    }
    catch (err) {
        logger_1.default.error(`Invalid token for refresh: ${err.message}`);
        res.status(401).json({ msg: "Token is not valid" });
    }
};
exports.refreshToken = refreshToken;
const generateResetCode = () => {
    return crypto_1.default.randomInt(10000, 99999); // Generates a 5-digit code
};
const resetPassword = async (req, res) => {
    const { mobileNumber } = req.body;
    // Validate input
    if (!mobileNumber) {
        return res.status(400).json({ msg: "Mobile number is required" });
    }
    try {
        // Find user by mobile number
        const user = await user_model_1.default.findOne({ mobileNumber });
        if (!user) {
            logger_1.default.info(`User with mobile number ${mobileNumber} not found.`);
            return res.status(404).json({ msg: "User not found" });
        }
        // Generate a 5-digit reset code
        const resetCode = generateResetCode();
        // Save the reset code to the user's record
        user.resetCode = resetCode;
        await user.save();
        // Send the reset code to the user's mobile number
        await (0, sms_1.sendSms)(mobileNumber, `Your password reset code is: ${resetCode}`);
        logger_1.default.info(`Password reset code sent to user with mobile number ${mobileNumber}.`);
        res.json({ msg: "Password reset code sent to your mobile number" });
    }
    catch (err) {
        logger_1.default.error(`Server error on password reset: ${err.message}`);
        res.status(500).send("Server error");
    }
};
exports.resetPassword = resetPassword;
const resetPasswordWithCode = async (req, res) => {
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
        const user = await user_model_1.default.findOne({ mobileNumber });
        if (!user) {
            logger_1.default.info(`User with mobile number ${mobileNumber} not found.`);
            return res.status(404).json({ msg: "User not found" });
        }
        // Verify the reset code
        if (user.resetCode !== parseInt(resetCode, 10)) {
            logger_1.default.info(`Invalid reset code for mobile number ${mobileNumber}.`);
            return res.status(400).json({ msg: "Invalid reset code" });
        }
        // Hash the new password
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
        // Update the user's password and clear the reset code
        user.password = hashedPassword;
        user.resetCode = undefined; // Clear the reset code
        await user.save();
        logger_1.default.info(`Password successfully reset for user with mobile number ${mobileNumber}.`);
        res.json({ msg: "Password successfully reset" });
    }
    catch (err) {
        logger_1.default.error(`Server error on password reset: ${err.message}`);
        res.status(500).send("Server error");
    }
};
exports.resetPasswordWithCode = resetPasswordWithCode;
// Update user info
const updateUser = async (req, res) => {
    const { id } = req.params; // User ID from route params
    const { name, mobileNumber, password, tag, profile_picture } = req.body;
    // Validate incoming request
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        logger_1.default.error("Validation error on updating user: " + JSON.stringify(errors.array()));
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Find the user by ID
        const user = await user_model_1.default.findById(id);
        if (!user) {
            logger_1.default.info(`User with ID ${id} not found.`);
            return res.status(404).json({ msg: "User not found" });
        }
        // Update user details
        if (name)
            user.name = name;
        if (mobileNumber)
            user.mobileNumber = mobileNumber;
        if (tag)
            user.tag = tag;
        if (password) {
            const salt = await bcryptjs_1.default.genSalt(10);
            user.password = await bcryptjs_1.default.hash(password, salt);
        }
        if (profile_picture)
            user.profile_picture = profile_picture;
        await user.save();
        logger_1.default.info(`User with ID ${id} updated successfully.`);
        res.json({ msg: "User updated successfully", user });
    }
    catch (err) {
        logger_1.default.error(`Server error on updating user: ${err.message}`);
        res.status(500).send("Server error");
    }
};
exports.updateUser = updateUser;
// Delete all users
const deleteAllUsers = async (req, res) => {
    try {
        console.log(req);
        await user_model_1.default.deleteMany({});
        logger_1.default.info("All users deleted.");
        res.json({ msg: "All users deleted" });
    }
    catch (err) {
        logger_1.default.error(`Server error on deleting all users: ${err.message}`);
        res.status(500).send("Server error");
    }
};
exports.deleteAllUsers = deleteAllUsers;
// Delete a single user
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await user_model_1.default.findById(id);
        if (!user) {
            logger_1.default.info(`User with ID ${id} not found.`);
            return res.status(404).json({ msg: "User not found" });
        }
        await user_model_1.default.findByIdAndDelete(id);
        logger_1.default.info(`User with ID ${id} deleted.`);
        res.json({ msg: "User deleted" });
    }
    catch (err) {
        logger_1.default.error(`Server error on deleting user: ${err.message}`);
        res.status(500).send("Server error");
    }
};
exports.deleteUser = deleteUser;
// Get all users with metadata
const getAllUsers = async (req, res) => {
    const { page = 1, limit = 10, tag, name } = req.query;
    const query = {};
    if (tag) {
        query.tag = new RegExp(tag, "i");
    }
    if (name) {
        query.name = new RegExp(name, "i");
    }
    try {
        const total = await user_model_1.default.countDocuments(query);
        const users = await user_model_1.default.find(query)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        const metadata = {
            total,
            current_page: Number(page),
            has_next_page: Number(page) * Number(limit) < total,
            has_previous_page: Number(page) > 1,
            next_page: Number(page) * Number(limit) < total ? Number(page) + 1 : null,
            previous_page: Number(page) > 1 ? Number(page) - 1 : null,
            last_page: Math.ceil(total / Number(limit)),
        };
        res.json({ users, metadata });
    }
    catch (err) {
        logger_1.default.error(`Server error on fetching users: ${err.message}`);
        res.status(500).send("Server error");
    }
};
exports.getAllUsers = getAllUsers;
const followUser = async (req, res) => {
    const { userIdToFollow } = req.body;
    const { userId } = req.params;
    try {
        // Convert string IDs to ObjectId
        const userToFollow = await user_model_1.default.findById(new mongoose_1.default.Types.ObjectId(userIdToFollow));
        const currentUser = await user_model_1.default.findById(new mongoose_1.default.Types.ObjectId(userId));
        if (!userToFollow || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if already following
        console.log(typeof currentUser.following);
        if (currentUser.following.some((id) => id === new mongoose_1.default.Schema.Types.ObjectId(userIdToFollow))) {
            return res.status(400).json({ message: "Already following this user" });
        }
        // Add to following and followers
        currentUser.following.push(new mongoose_1.default.Schema.Types.ObjectId(userIdToFollow));
        userToFollow.followers.push(new mongoose_1.default.Schema.Types.ObjectId(userId));
        await currentUser.save();
        await userToFollow.save();
        res.status(200).json({ message: "Successfully followed user" });
    }
    catch (error) {
        console.error(`Server error on following user: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message || error });
    }
};
exports.followUser = followUser;
const unfollowUser = async (req, res) => {
    const { userIdToUnfollow } = req.body;
    const { userId } = req.params;
    try {
        // Convert string IDs to ObjectId
        const userToUnfollow = await user_model_1.default.findById(new mongoose_1.default.Types.ObjectId(userIdToUnfollow));
        const currentUser = await user_model_1.default.findById(new mongoose_1.default.Types.ObjectId(userId));
        if (!userToUnfollow || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // Convert ObjectId to strings for comparison
        const userIdToUnfollowStr = new mongoose_1.default.Types.ObjectId(userIdToUnfollow).toString();
        const userIdStr = new mongoose_1.default.Types.ObjectId(userId).toString();
        // Check if following
        const isFollowing = currentUser.following.some((id) => id.toString() === userIdToUnfollowStr);
        if (!isFollowing) {
            return res.status(400).json({ message: "Not following this user" });
        }
        // Remove from following and followers
        currentUser.following = currentUser.following.filter((id) => id.toString() !== userIdToUnfollowStr);
        userToUnfollow.followers = userToUnfollow.followers.filter((id) => id.toString() !== userIdStr);
        await currentUser.save();
        await userToUnfollow.save();
        res.status(200).json({ message: "Successfully unfollowed user" });
    }
    catch (error) {
        console.error(`Server error on unfollowing user: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message || error });
    }
};
exports.unfollowUser = unfollowUser;
const getFollowing = async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10, search } = req.query;
    try {
        const user = await user_model_1.default.findById(userId).populate({
            path: "following",
            select: "name tag",
            match: search
                ? {
                    $or: [{ name: new RegExp(search, "i") }, { tag: new RegExp(search, "i") }],
                }
                : {},
            options: {
                skip: (Number(page) - 1) * Number(limit),
                limit: Number(limit),
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const total = user.following.length;
        const metadata = {
            total,
            current_page: Number(page),
            has_next_page: Number(page) * Number(limit) < total,
            has_previous_page: Number(page) > 1,
            next_page: Number(page) * Number(limit) < total ? Number(page) + 1 : null,
            previous_page: Number(page) > 1 ? Number(page) - 1 : null,
            last_page: Math.ceil(total / Number(limit)),
        };
        res.status(200).json({ following: user.following, metadata });
    }
    catch (error) {
        console.error(`Server error on fetching following users: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message || error });
    }
};
exports.getFollowing = getFollowing;
const getFollowers = async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10, search } = req.query;
    try {
        const user = await user_model_1.default.findById(userId).populate({
            path: "followers",
            select: "name tag",
            match: search
                ? {
                    $or: [{ name: new RegExp(search, "i") }, { tag: new RegExp(search, "i") }],
                }
                : {},
            options: {
                skip: (Number(page) - 1) * Number(limit),
                limit: Number(limit),
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const total = user.followers.length;
        const metadata = {
            total,
            current_page: Number(page),
            has_next_page: Number(page) * Number(limit) < total,
            has_previous_page: Number(page) > 1,
            next_page: Number(page) * Number(limit) < total ? Number(page) + 1 : null,
            previous_page: Number(page) > 1 ? Number(page) - 1 : null,
            last_page: Math.ceil(total / Number(limit)),
        };
        res.status(200).json({ followers: user.followers, metadata });
    }
    catch (error) {
        console.error(`Server error on fetching followers: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message || error });
    }
};
exports.getFollowers = getFollowers;
//# sourceMappingURL=auth.contoller.js.map