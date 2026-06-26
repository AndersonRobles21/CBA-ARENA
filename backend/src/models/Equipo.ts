export interface Equipo {
  id: string;
  nombre: string;
  region?: string;
  integrantes: number;
  torneo_id: string;
  created_at: string;
}
