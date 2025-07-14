import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN;

const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ message: "Access token missing " });
    }
    try {
        const decoded = jwt.verify(token, ACCESS_SECRET);
        req.userId = decoded.id;

        next();
    }
    catch {
        return res.status(403).json({ message: "Invalid token" });
    }
}
export { verifyToken };