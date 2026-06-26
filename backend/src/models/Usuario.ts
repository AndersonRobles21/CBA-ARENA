export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: "usuario" | "admin";
  created_at: string;
}
