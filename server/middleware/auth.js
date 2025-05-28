import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; // Sørg for at gemme denne i din .env-fil

// Middleware til at verificere JWT-token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Tjek for token i Authorization-headeren
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Fjern "Bearer" og få selve token
    try {
        // Verificér token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Gem de dekodede brugeroplysninger på req-objektet
        next(); // Videre til næste middleware eller route-handler
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

export default authenticateToken;