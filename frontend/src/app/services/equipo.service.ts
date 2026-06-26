import { Equipo } from "../interfaces";
import { API_BASE } from './api-base';

export class EquipoService {
  async getAll(token: string): Promise<Equipo[]> {
    const response = await fetch(`${API_BASE}/equipos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok ? response.json() : Promise.reject(response.statusText);
  }

  async create(equipo: Partial<Equipo>, token: string): Promise<Equipo> {
    const response = await fetch(`${API_BASE}/equipos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(equipo),
    });
    return response.ok ? response.json() : Promise.reject(response.statusText);
  }

  async update(id: string, equipo: Partial<Equipo>, token: string): Promise<Equipo> {
    const response = await fetch(`${API_BASE}/equipos/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(equipo),
    });
    return response.ok ? response.json() : Promise.reject(response.statusText);
  }

  async delete(id: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE}/equipos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok ? Promise.resolve() : Promise.reject(response.statusText);
  }
}
