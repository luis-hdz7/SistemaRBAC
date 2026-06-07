import bcrypt from "bcryptjs"
import asyncHandler from "../middleware/error.js"
import jwt from "jsonwebtoken"
import { prisma } from "../config/dbConnect.js";
export const register =asyncHandler(async (req, res) => {
  const { password,name,role,email } = req.body;

  // Verificar que el usuario ya exista
  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    return res
      .status(400)
      .json({ error: "El usuario con este correo electrónico ya existe" });
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Crear Usuario
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });
  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: name,
        email: email,
        role: role,
      },
    },
  });
});
//Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }
  const token= jwt.sign({
    id: user.id,
    email: user.email,
    role: user.role
  }, process.env.JWT_SECRET, { expiresIn: "1h"
  })
  res.status(200).json({
    token
  })
});

export default {
    register,
    login
}