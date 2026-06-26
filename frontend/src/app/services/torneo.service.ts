import { Torneo, Estadisticas } from "../interfaces";
import { API_BASE } from './api-base';

export class TorneoService {
  async getAll(token: string): Promise<Torneo[]> {
    const response = await fetch(`${API_BASE}/torneos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok ? response.json() : Promise.reject(response.statusText);
  }

  async getEstadisticas(token: string): Promise<Estadisticas> {
    const response = await fetch(`${API_BASE}/torneos/estadisticas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok ? response.json() : Promise.reject(response.statusText);
  }

  async create(torneo: Partial<Torneo>, token: string): Promise<Torneo> {
    const response = await fetch(`${API_BASE}/torneos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(torneo),
    });
    return response.ok ? response.json() : Promise.reject(response.statusText);
  }

  async update(id: string, torneo: Partial<Torneo>, token: string): Promise<Torneo> {
    const response = await fetch(`${API_BASE}/torneos/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(torneo),
    });
    return response.ok ? response.json() : Promise.reject(response.statusText);
  }

  async delete(id: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE}/torneos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok ? Promise.resolve() : Promise.reject(response.statusText);
  }
}
