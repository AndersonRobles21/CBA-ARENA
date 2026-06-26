import { Request, Response } from "express";
import { pool } from "../config/db";

function mapEquipoRow(row: any) {
  return {
    id: row.id_equipo,
    nombre: row.nombre,
    logo_url: row.logo_url,
    torneo_id: row.torneo_id,
    torneo: row.torneo,
    created_at: row.fecha_creacion,
  };
}

export async function listarEquipos(req: Request, res: Response): Promise<void> {
  try {
    const resultado = await pool.query(`
      SELECT e.id_equipo, e.nombre, e.logo_url, e.fecha_creacion,
        t.id_torneo AS torneo_id, t.nombre AS torneo
      FROM cba_equipos e
      LEFT JOIN cba_torneo_equipo te ON te.id_equipo = e.id_equipo
      LEFT JOIN cba_torneos t ON t.id_torneo = te.id_torneo
      ORDER BY e.fecha_creacion DESC
    `);
    res.status(200).json(resultado.rows.map(mapEquipoRow));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "No se pudieron listar los equipos" });
  }
}

export async function obtenerEquipo(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      `SELECT e.id_equipo, e.nombre, e.logo_url, e.fecha_creacion,
        t.id_torneo AS torneo_id, t.nombre AS torneo
      FROM cba_equipos e
      LEFT JOIN cba_torneo_equipo te ON te.id_equipo = e.id_equipo
      LEFT JOIN cba_torneos t ON t.id_torneo = te.id_torneo
      WHERE e.id_equipo = $1`,
      [id]
    );

    if (resultado.rowCount === 0) {
      res.status(404).json({ mensaje: "Equipo no encontrado" });
      return;
    }

    res.status(200).json(mapEquipoRow(resultado.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "No se pudo obtener el equipo" });
  }
}

export async function crearEquipo(req: Request, res: Response): Promise<void> {
  try {
    const { nombre, torneo_id } = req.body;

    if (!nombre) {
      res.status(400).json({ mensaje: "El nombre del equipo es obligatorio" });
      return;
    }

    const insercion = await pool.query(
      `INSERT INTO cba_equipos (nombre, logo_url) VALUES ($1, $2) RETURNING id_equipo`,
      [nombre, null]
    );

    const equipoId = insercion.rows[0].id_equipo;

    if (torneo_id) {
      await pool.query(`INSERT INTO cba_torneo_equipo (id_torneo, id_equipo) VALUES ($1, $2)`, [torneo_id, equipoId]);
    }

    const resultado = await pool.query(
      `SELECT e.id_equipo, e.nombre, e.logo_url, e.fecha_creacion,
        t.id_torneo AS torneo_id, t.nombre AS torneo
      FROM cba_equipos e
      LEFT JOIN cba_torneo_equipo te ON te.id_equipo = e.id_equipo
      LEFT JOIN cba_torneos t ON t.id_torneo = te.id_torneo
      WHERE e.id_equipo = $1`,
      [equipoId]
    );

    res.status(201).json(mapEquipoRow(resultado.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "No se pudo crear el equipo" });
  }
}

export async function actualizarEquipo(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { nombre, torneo_id } = req.body;

    const resultado = await pool.query(
      `UPDATE cba_equipos SET nombre = $1 WHERE id_equipo = $2 RETURNING id_equipo`,
      [nombre, id]
    );

    if (resultado.rowCount === 0) {
      res.status(404).json({ mensaje: "Equipo no encontrado" });
      return;
    }

    await pool.query(`DELETE FROM cba_torneo_equipo WHERE id_equipo = $1`, [id]);

    if (torneo_id) {
      await pool.query(`INSERT INTO cba_torneo_equipo (id_torneo, id_equipo) VALUES ($1, $2)`, [torneo_id, id]);
    }

    const equipoActualizado = await pool.query(
      `SELECT e.id_equipo, e.nombre, e.logo_url, e.fecha_creacion,
        t.id_torneo AS torneo_id, t.nombre AS torneo
      FROM cba_equipos e
      LEFT JOIN cba_torneo_equipo te ON te.id_equipo = e.id_equipo
      LEFT JOIN cba_torneos t ON t.id_torneo = te.id_torneo
      WHERE e.id_equipo = $1`,
      [id]
    );

    res.status(200).json(mapEquipoRow(equipoActualizado.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "No se pudo actualizar el equipo" });
  }
}

export async function eliminarEquipo(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM cba_torneo_equipo WHERE id_equipo = $1`, [id]);
    const resultado = await pool.query(`DELETE FROM cba_equipos WHERE id_equipo = $1`, [id]);

    if (resultado.rowCount === 0) {
      res.status(404).json({ mensaje: "Equipo no encontrado" });
      return;
    }

    res.status(200).json({ mensaje: "Equipo eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "No se pudo eliminar el equipo" });
  }
}
