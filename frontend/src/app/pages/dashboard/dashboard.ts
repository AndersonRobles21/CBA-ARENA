import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TorneoService } from '../../services/torneo.service';
import { Estadisticas } from '../../interfaces';

const torneoService = new TorneoService();

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  estadisticas: Estadisticas | null = null;
  error = '';
  cargando = false;

  get token(): string {
    return typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('token') ?? '' : '';
  }

  constructor() {
    this.cargarEstadisticas();
  }

  async cargarEstadisticas() {
    this.cargando = true;
    this.error = '';
    try {
      this.estadisticas = await torneoService.getEstadisticas(this.token);
    } catch (error) {
      this.error = String(error);
    } finally {
      this.cargando = false;
    }
  }
}
