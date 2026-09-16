const userRepository = require("../repositories/userRepository.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../middlewares/authMiddleware.js");

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await userRepository.findByEmail(email);

      if (!user) {
        return res.status(401).json({ message: "Datos de acceso incorrectos" });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ message: "Datos de acceso incorrectos" });
      }

      const token = jwt.sign(
        {
          id: user.idusers,
          email: user.email,
          role: user.role,
          name: user.name,
        },
        SECRET_KEY,
        { expiresIn: "7h" },
      );

      res.cookie("puntoytrama", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.idusers,
          email: user.email,
          role: user.role,
          name: user.name,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  registerAdmin: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = await userRepository.create({
        name,
        email,
        hashedPassword,
      });
      return res
        .status(201)
        .json({ message: "User created successfully", userId });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  logout: async (req, res) => {
    res.clearCookie("puntoytrama");
    return res.status(200).json({ message: "Logout successful" });
  },
  verifySession: async (req, res) => {
    const token =
      req.cookies?.puntoytrama || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(200).json({ authenticated: false, user: null });
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);

      return res.status(200).json({
        user: {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name || "Administrador",
        },
      });
    } catch (err) {
      console.error(err.message);
      return res.status(200).json({ authenticated: false, user: null });
    }
  },
};

module.exports = authController;
