import { Request, Response } from "express";
import { pool } from "../config/db";

function mapPartidaRow(row: any) {
  return {
    id: row.id_partida,
    torneo_id: row.id_torneo,
    equipo_a_id: row.equipo_local,
    equipo_b_id: row.equipo_visitante,
    fecha: row.fecha_partida,
    resultado: `${row.marcador_local}-${row.marcador_visitante}`,
    estado: row.ganador === null ? "pendiente" : "finalizada",
    equipo_a: row.equipo_a,
    equipo_b: row.equipo_b,
    torneo: row.torneo,
    created_at: row.fecha_partida,
  };
}

function parseResultado(resultado?: string) {
  const defaultResult = { marcador_local: 0, marcador_visitante: 0 };
  const clean = (resultado ?? "").trim();
  const match = clean.match(/^(\d+)\s*[-:\s]+\s*(\d+)$/);
  if (!match) {
    return defaultResult;
  }
  const marcador_local = Number(match[1]);
  const marcador_visitante = Number(match[2]);
  return { marcador_local, marcador_visitante };
}

function determineGanador(marcador_local: number, marcador_visitante: number, equipo_local: string, equipo_visitante: string) {
  if (marcador_local > marcador_visitante) return Number(equipo_local);
  if (marcador_visitante > marcador_local) return Number(equipo_visitante);
  return null;
}

export async function listarPartidas(req: Request, res: Response): Promise<void> {
  try {
    const resultado = await pool.query(`
      SELECT p.*, ta.nombre AS equipo_a, tb.nombre AS equipo_b, t.nombre AS torneo
      FROM cba_partidas p
      JOIN cba_equipos ta ON ta.id_equipo = p.equipo_local
      JOIN cba_equipos tb ON tb.id_equipo = p.equipo_visitante
      JOIN cba_torneos t ON t.id_torneo = p.id_torneo
      ORDER BY p.fecha_partida DESC
    `);
    res.status(200).json(resultado.rows.map(mapPartidaRow));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "No se pudieron listar las partidas" });
  }
}

export async function obtenerPartida(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      `SELECT p.*, ta.nombre AS equipo_a, tb.nombre AS equipo_b, t.nombre AS torneo
       FROM cba_partidas p
       JOIN cba_equipos ta ON ta.id_equipo = p.equipo_local
       JOIN cba_equipos tb ON tb.id_equipo = p.equipo_visitante
       JOIN cba_torneos t ON t.id_torneo = p.id_torneo
       WHERE p.id_partida = $1`,
      [id]
    );

    if (resultado.rowCount === 0) {
      res.status(404).json({ mensaje: "Partida no encontrada" });
      return;
    }

    res.status(200).json(mapPartidaRow(resultado.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "No se pudo obtener la partida" });
  }
}

export async function crearPartida(req: Request, res: Response): Promise<void> {
  try {
    const { torneo_id, equipo_a_id, equipo_b_id, fecha, resultado, estado } = req.body;

    if (!torneo_id || !equipo_a_id || !equipo_b_id) {
      res.status(400).json({ mensaje: "Torneo y equipos son obligatorios" });
      return;
    }

    if (equipo_a_id === equipo_b_id) {
      res.status(400).json({ mensaje: "Los equipos deben ser diferentes" });
      return;
    }

    const { marcador_local, marcador_visitante } = parseResultado(resultado);
    const ganador = determineGanador(marcador_local, marcador_visitante, equipo_a_id, equipo_b_id);

    const insercion = await pool.query(
      `INSERT INTO cba_partidas (id_torneo, equipo_local, equipo_visitante, fecha_partida, marcador_local, marcador_visitante, ganador)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [torneo_id, equipo_a_id, equipo_b_id, fecha || null, marcador_local, marcador_visitante, ganador]
    );

    res.status(201).json(mapPartidaRow(insercion.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "No se pudo crear la partida" });
  }
}

export async function actualizarPartida(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { torneo_id, equipo_a_id, equipo_b_id, fecha, resultado, estado } = req.body;

    if (!torneo_id || !equipo_a_id || !equipo_b_id) {
      res.status(400).json({ mensaje: "Torneo y equipos son obligatorios" });
      return;
    }

    if (equipo_a_id === equipo_b_id) {
      res.status(400).json({ mensaje: "Los equipos deben ser diferentes" });
      return;
    }

    const { marcador_local, marcador_visitante } = parseResultado(resultado);
    const ganador = determineGanador(marcador_local, marcador_visitante, equipo_a_id, equipo_b_id);

    const resultadoActualizado = await pool.query(
      `UPDATE cba_partidas SET id_torneo = $1, equipo_local = $2, equipo_visitante = $3, fecha_partida = $4,
        marcador_local = $5, marcador_visitante = $6, ganador = $7
       WHERE id_partida = $8 RETURNING *`,
      [torneo_id, equipo_a_id, equipo_b_id, fecha || null, marcador_local, marcador_visitante, ganador, id]
    );

    if (resultadoActualizado.rowCount === 0) {
      res.status(404).json({ mensaje: "Partida no encontrada" });
      return;
    }

    res.status(200).json(mapPartidaRow(resultadoActualizado.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "No se pudo actualizar la partida" });
  }
}

export async function eliminarPartida(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const resultado = await pool.query(`DELETE FROM cba_partidas WHERE id_partida = $1`, [id]);

    if (resultado.rowCount === 0) {
      res.status(404).json({ mensaje: "Partida no encontrada" });
      return;
    }

    res.status(200).json({ mensaje: "Partida eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "No se pudo eliminar la partida" });
  }
}
