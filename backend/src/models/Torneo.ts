export interface Torneo {
  id: string;
  nombre: string;
  juego: string;
  descripcion?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado: "planeado" | "en curso" | "finalizado";
  organizador_id: string;
  created_at: string;
}
