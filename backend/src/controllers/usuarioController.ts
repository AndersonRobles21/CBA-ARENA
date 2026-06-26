import { Request, Response } from "express";
import { pool } from "../config/db";
import { UsuarioAutenticado } from "../middlewares/authMiddleware";

export async function listarUsuarios(req: Request, res: Response): Promise<void> {
  try {
    const resultado = await pool.query(`
      SELECT u.id_usuario AS id, u.nombre, u.correo, r.nombre AS role, u.fecha_registro AS created_at
      FROM cba_usuarios u
      JOIN cba_roles r ON r.id_rol = u.id_rol
      ORDER BY u.fecha_registro DESC
    `);
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "No se pudieron obtener los usuarios" });
  }
}

export async function perfilUsuario(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user as UsuarioAutenticado;
    const resultado = await pool.query(`
      SELECT u.id_usuario AS id, u.nombre, u.correo, r.nombre AS role, u.fecha_registro AS created_at
      FROM cba_usuarios u
      JOIN cba_roles r ON r.id_rol = u.id_rol
      WHERE u.id_usuario = $1
    `, [user.id]);

    if (resultado.rowCount === 0) {
      res.status(404).json({ mensaje: "Usuario no encontrado" });
      return;
    }

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "No se pudo obtener el perfil" });
  }
}
