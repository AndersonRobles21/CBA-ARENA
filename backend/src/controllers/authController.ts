import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET ?? "secret123";
const JWT_EXPIRES = "8h";

async function obtenerRolId(nombreRol: string): Promise<number> {
  const resultado = await pool.query(`SELECT id_rol FROM cba_roles WHERE nombre = $1`, [nombreRol]);

  if (resultado.rows.length > 0) {
    return resultado.rows[0].id_rol;
  }

  const insertRol = await pool.query(`INSERT INTO cba_roles (nombre) VALUES ($1) RETURNING id_rol`, [nombreRol]);
  return insertRol.rows[0].id_rol;
}

export async function registrarUsuario(req: Request, res: Response): Promise<void> {
  try {
    const { nombre, correo, password, role } = req.body;

    if (!nombre || !correo || !password) {
      res.status(400).json({ mensaje: "Datos incompletos" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const usuarioRole = role === "admin" ? "admin" : "usuario";
    const idRol = await obtenerRolId(usuarioRole);

    const resultado = await pool.query(
      `INSERT INTO cba_usuarios (nombre, correo, password_hash, id_rol) VALUES ($1, $2, $3, $4) RETURNING id_usuario AS id, nombre, correo`,
      [nombre, correo, passwordHash, idRol]
    );

    res.status(201).json({ usuario: { ...resultado.rows[0], role: usuarioRole } });
  } catch (error: unknown) {
    console.error(error);

    if (error instanceof Error && error.message.includes("duplicate key value")) {
      res.status(409).json({ mensaje: "El correo ya está registrado" });
      return;
    }

    res.status(500).json({ mensaje: "No se pudo registrar el usuario" });
  }
}

export async function loginUsuario(req: Request, res: Response): Promise<void> {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      res.status(400).json({ mensaje: "Correo y contraseña son obligatorios" });
      return;
    }

    const usuario = await pool.query(
      `SELECT u.id_usuario AS id, u.nombre, u.correo, u.password_hash AS password, r.nombre AS rol
       FROM cba_usuarios u
       JOIN cba_roles r ON r.id_rol = u.id_rol
       WHERE u.correo = $1`,
      [correo]
    );

    if (usuario.rowCount === 0) {
      res.status(401).json({ mensaje: "Credenciales inválidas" });
      return;
    }

    const usuarioData = usuario.rows[0];
    const passwordMatch = await bcrypt.compare(password, usuarioData.password);

    if (!passwordMatch) {
      res.status(401).json({ mensaje: "Credenciales inválidas" });
      return;
    }

    const token = jwt.sign(
      { id: usuarioData.id, correo: usuarioData.correo, role: usuarioData.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.status(200).json({
      token,
      usuario: {
        id: usuarioData.id,
        nombre: usuarioData.nombre,
        correo: usuarioData.correo,
        role: usuarioData.rol,
      },
    });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en autenticación" });
  }
}
