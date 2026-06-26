import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../interfaces';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

@Component({
  standalone: true,
  selector: 'app-perfil',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="section-shell">
      <div class="panel">
        <h1>Perfil</h1>
        <p class="subtitle">Información de cuenta y rol en CBA Arena.</p>
        <div class="profile-card">
          <h2>{{ usuario?.nombre }}</h2>
          <p><strong>Email:</strong> {{ usuario?.correo }}</p>
          <p><strong>Rol:</strong> {{ usuario?.role }}</p>
          <p><strong>Registrado desde:</strong> {{ usuario?.created_at | date:'mediumDate' }}</p>
          <a routerLink="/dashboard" class="secondary-button">Volver al Dashboard</a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .section-shell {
        padding: 2rem 1.5rem;
      }
      .panel {
        max-width: 900px;
        margin: 0 auto;
      }
      .profile-card {
        padding: 2rem;
        border-radius: 1.5rem;
        background: rgba(18, 18, 18, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
        color: #eee;
      }
      .profile-card h2 {
        margin-bottom: 1rem;
      }
      .profile-card p {
        margin: 0.75rem 0;
      }
      .secondary-button {
        display: inline-block;
        margin-top: 1.5rem;
        padding: 0.95rem 1.5rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        color: #fff;
        text-decoration: none;
        border: 1px solid rgba(255, 255, 255, 0.12);
      }
      .secondary-button:hover {
        background: rgba(255, 0, 0, 0.16);
        border-color: rgba(255, 0, 0, 0.24);
      }
    `,
  ],
})
export class Perfil {
  usuario: Usuario | null = null;

  constructor() {
    if (!isBrowser()) {
      return;
    }

    const user = window.localStorage.getItem('user');
    this.usuario = user ? JSON.parse(user) : null;
  }
}
