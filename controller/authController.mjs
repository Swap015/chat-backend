import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

//tokens
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id }, ACCESS_TOKEN, { expiresIn: '15m' });
};
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, REFRESH_TOKEN, { expiresIn: '1d' });
};

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashed });
        await user.save();
        res.json(user);
    }
    catch (err) {
        console.log("error:", err);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.json({ message: "Invalid Credentials" });
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: "/",
        }).json({ message: "Login successful" });
    }
    catch {
        res.json({ message: "Login Unsuccessful" });
    }
};


// Inside authController.mjs
const profile = async (req, res) => {
    try {
        const user = await User.findById(req.user).select('-password -refreshToken'); // exclude sensitive fields
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching profile" });
    }
};

const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.json({ message: "Access Denied" });
    }
    try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN);
        const user = await User.findById(decoded.id);
        if (!user || !user.refreshToken) {
            return res.json({ message: "Invalid Refresh Token" });
        }
        const newAccessToken = generateAccessToken(user);
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: "/"
        }).json({ message: "Access Token refreshed" });
    }
    catch (err) {
        return res.json({ message: "Invalid or expired refresh token" });
    }
};


export const logout = async (req, res) => {
    const accessToken = req.cookies.accessToken;           // ⬅️ get from cookie
    if (!accessToken) return res.sendStatus(204);           // already logged‑out

    const user = await User.findOne({ email: req.body.email });
    if (user) {
        user.accessToken = "";
        await user.save();
    }
    res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
    }).json({ message: "Logout successful" });
};


export default { register, login, logout, refresh, profile };