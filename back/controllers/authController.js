const userRepository = require("../repositories/userRepository.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../middlewares/authMiddleware.js");

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("➡️ Intento de login con email:", email);

      const user = await userRepository.findByEmail(email);
      console.log("👤 Usuario encontrado en DB:", user);

      if (!user) {
        console.log(
          "❌ No se encontró ningún usuario con ese email en la tabla users",
        );
        return res.status(401).json({ message: "User not found" });
      }

      console.log("🔑 Password recibida:", password);
      console.log("🔒 Password hasheada en DB:", user.password);

      const validPassword = await bcrypt.compare(password, user.password);
      console.log("⚖️ ¿Contraseña válida?:", validPassword);

      if (!validPassword) {
        console.log("❌ La contraseña no coincide con el hash");
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { id: user.idusers, email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: "24h" },
      );

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
      console.log(error);
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
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = authController;
