import { Injectable } from '@angular/core';
import { API_BASE } from './api-base';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  async login(correo: string, password: string): Promise<{ token: string; usuario: Record<string, any> }> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.mensaje || 'Error de autenticación');
    }

    const data = await response.json();
    this.saveSession(data.token, data.usuario);
    return data;
  }

  async register(nombre: string, correo: string, password: string): Promise<void> {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, password }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.mensaje || 'Error registrando el usuario');
    }
  }

  saveSession(token: string, usuario: Record<string, any>): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('user', JSON.stringify(usuario));
    }
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
    }
  }

  getToken(): string {
    if (typeof window === 'undefined' || !window.localStorage) {
      return '';
    }
    return window.localStorage.getItem('token') ?? '';
  }

  getUser(): Record<string, any> | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    const raw = window.localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
