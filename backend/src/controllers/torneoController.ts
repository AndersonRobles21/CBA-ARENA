import { Request, Response } from "express";
import { pool } from "../config/db";
import { UsuarioAutenticado } from "../middlewares/authMiddleware";

function mapTorneoRow(row: any) {
  return {
    id: row.id_torneo,
    nombre: row.nombre,
    juego: row.videojuego,
    descripcion: row.descripcion,
    fecha_inicio: row.fecha_inicio,
    fecha_fin: row.fecha_fin,
    estado: row.estado,
    organizador_id: row.organizador_id,
    organizador: row.organizador,
    created_at: row.fecha_creacion,
  };
}

export async function listarTorneos(req: Request, res: Response): Promise<void> {
  try {
    const resultado = await pool.query(`
      SELECT t.*, u.nombre AS organizador
      FROM cba_torneos t
      LEFT JOIN cba_usuarios u ON u.id_usuario = t.organizador_id
      ORDER BY t.fecha_creacion DESC
    `);
    res.status(200).json(resultado.rows.map(mapTorneoRow));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "No se pudieron listar los torneos" });
  }
}

export async function obtenerTorneo(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      `SELECT t.*, u.nombre AS organizador FROM cba_torneos t LEFT JOIN cba_usuarios u ON u.id_usuario = t.organizador_id WHERE t.id_torneo = $1`,
      [id]
    );

    if (resultado.rowCount === 0) {
      res.status(404).json({ mensaje: "Torneo no encontrado" });
      return;
    }

    res.status(200).json(mapTorneoRow(resultado.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "No se pudo obtener el torneo" });
  }
}

export async function crearTorneo(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user as UsuarioAutenticado;
    const { nombre, juego, descripcion, fecha_inicio, fecha_fin, estado } = req.body;

    if (!nombre || !juego) {
      res.status(400).json({ mensaje: "Nombre y juego son obligatorios" });
      return;
    }

    const resultado = await pool.query(
      `INSERT INTO cba_torneos (nombre, videojuego, descripcion, fecha_inicio, fecha_fin, estado, organizador_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [nombre, juego, descripcion || null, fecha_inicio || null, fecha_fin || null, estado || "planeado", user.id]
    );

    res.status(201).json(mapTorneoRow(resultado.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "No se pudo crear el torneo" });
  }
}

export async function actualizarTorneo(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { nombre, juego, descripcion, fecha_inicio, fecha_fin, estado } = req.body;

    const resultado = await pool.query(
      `UPDATE cba_torneos SET nombre = $1, videojuego = $2, descripcion = $3, fecha_inicio = $4, fecha_fin = $5, estado = $6 WHERE id_torneo = $7 RETURNING *`,
      [nombre, juego, descripcion || null, fecha_inicio || null, fecha_fin || null, estado || "planeado", id]
    );

    if (resultado.rowCount === 0) {
      res.status(404).json({ mensaje: "Torneo no encontrado" });
      return;
    }

    res.status(200).json(mapTorneoRow(resultado.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "No se pudo actualizar el torneo" });
  }
}

export async function eliminarTorneo(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const resultado = await pool.query(`DELETE FROM cba_torneos WHERE id_torneo = $1`, [id]);

    if (resultado.rowCount === 0) {
      res.status(404).json({ mensaje: "Torneo no encontrado" });
      return;
    }

    res.status(200).json({ mensaje: "Torneo eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "No se pudo eliminar el torneo" });
  }
}

export async function obtenerEstadisticas(req: Request, res: Response): Promise<void> {
  try {
    const [torneos, equipos, partidas, ultimos] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS total FROM cba_torneos`),
      pool.query(`SELECT COUNT(*)::int AS total FROM cba_equipos`),
      pool.query(`SELECT COUNT(*)::int AS total FROM cba_partidas`),
      pool.query(`SELECT id_torneo AS id, nombre, videojuego AS juego, fecha_inicio, estado FROM cba_torneos ORDER BY fecha_creacion DESC LIMIT 5`),
    ]);

    res.status(200).json({
      totalTorneos: torneos.rows[0].total,
      totalEquipos: equipos.rows[0].total,
      totalPartidas: partidas.rows[0].total,
      ultimosTorneos: ultimos.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "No se pudieron obtener las estadísticas" });
  }
}

export async function obtenerUltimosTorneos(req: Request, res: Response): Promise<void> {
  try {
    const resultado = await pool.query(`SELECT id_torneo AS id, nombre, videojuego AS juego, fecha_inicio, estado FROM cba_torneos ORDER BY fecha_creacion DESC LIMIT 5`);
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "No se pudieron obtener los últimos torneos" });
  }
}
