export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  role: "usuario" | "admin";
  created_at: string;
}

export interface Torneo {
  id: string;
  nombre: string;
  juego: string;
  descripcion?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado: "planeado" | "en curso" | "finalizado";
  organizador_id?: string;
  organizador?: string;
  created_at?: string;
}

export interface Equipo {
  id: string;
  nombre: string;
  region?: string;
  integrantes: number;
  torneo_id: string;
  torneo?: string;
  created_at?: string;
}

export interface Partida {
  id: string;
  torneo_id: string;
  equipo_a_id: string;
  equipo_b_id: string;
  fecha?: string;
  resultado?: string;
  estado: "pendiente" | "finalizada";
  equipo_a?: string;
  equipo_b?: string;
  torneo?: string;
  created_at?: string;
}

export interface Estadisticas {
  totalTorneos: number;
  totalEquipos: number;
  totalPartidas: number;
  ultimosTorneos: Torneo[];
}
