export interface Partida {
  id: string;
  torneo_id: string;
  equipo_a_id: string;
  equipo_b_id: string;
  fecha?: string;
  resultado?: string;
  estado: "pendiente" | "finalizada";
  created_at: string;
}
