import { Partida } from "../interfaces";
import { API_BASE } from './api-base';

export class PartidaService {
  async getAll(token: string): Promise<Partida[]> {
    const response = await fetch(`${API_BASE}/partidas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok ? response.json() : Promise.reject(response.statusText);
  }

  async create(partida: Partial<Partida>, token: string): Promise<Partida> {
    const response = await fetch(`${API_BASE}/partidas`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(partida),
    });
    return response.ok ? response.json() : Promise.reject(response.statusText);
  }

  async update(id: string, partida: Partial<Partida>, token: string): Promise<Partida> {
    const response = await fetch(`${API_BASE}/partidas/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(partida),
    });
    return response.ok ? response.json() : Promise.reject(response.statusText);
  }

  async delete(id: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE}/partidas/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok ? Promise.resolve() : Promise.reject(response.statusText);
  }
}
