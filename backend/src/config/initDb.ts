import { pool } from "./db";

export async function initDb(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cba_roles (
      id_rol INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL UNIQUE
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cba_usuarios (
      id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      nombre VARCHAR(200) NOT NULL,
      correo VARCHAR(200) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      id_rol INTEGER NOT NULL REFERENCES cba_roles(id_rol),
      fecha_registro TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cba_torneos (
      id_torneo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      nombre VARCHAR(200) NOT NULL,
      videojuego VARCHAR(150) NOT NULL,
      descripcion TEXT,
      fecha_inicio DATE NOT NULL,
      fecha_fin DATE NOT NULL,
      estado VARCHAR(40) DEFAULT 'Activo',
      organizador_id INTEGER REFERENCES cba_usuarios(id_usuario),
      fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    ALTER TABLE cba_torneos
    ADD COLUMN IF NOT EXISTS organizador_id INTEGER REFERENCES cba_usuarios(id_usuario);
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cba_equipos (
      id_equipo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      nombre VARCHAR(200) NOT NULL,
      logo_url TEXT,
      fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cba_recursos (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      nombre VARCHAR(200) NOT NULL,
      descripcion TEXT,
      capacidad INTEGER NOT NULL,
      fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cba_horarios (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      hora_inicio TIME NOT NULL,
      hora_fin TIME NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cba_reservas (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      recurso_id INTEGER NOT NULL REFERENCES cba_recursos(id),
      usuario_id INTEGER NOT NULL REFERENCES cba_usuarios(id_usuario),
      horario_id INTEGER NOT NULL REFERENCES cba_horarios(id),
      fecha DATE NOT NULL,
      estado VARCHAR(40) DEFAULT 'activa',
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cba_jugadores (
      id_jugador INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      nickname VARCHAR(200) NOT NULL,
      id_usuario INTEGER REFERENCES cba_usuarios(id_usuario),
      id_equipo INTEGER NOT NULL REFERENCES cba_equipos(id_equipo)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cba_torneo_equipo (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_torneo INTEGER NOT NULL REFERENCES cba_torneos(id_torneo),
      id_equipo INTEGER NOT NULL REFERENCES cba_equipos(id_equipo)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cba_partidas (
      id_partida INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_torneo INTEGER NOT NULL REFERENCES cba_torneos(id_torneo),
      equipo_local INTEGER NOT NULL REFERENCES cba_equipos(id_equipo),
      equipo_visitante INTEGER NOT NULL REFERENCES cba_equipos(id_equipo),
      fecha_partida TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      marcador_local INTEGER DEFAULT 0,
      marcador_visitante INTEGER DEFAULT 0,
      ganador INTEGER REFERENCES cba_equipos(id_equipo)
    );
  `);
}
