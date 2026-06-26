import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Equipo, Torneo } from '../../interfaces';
import { EquipoService } from '../../services/equipo.service';
import { TorneoService } from '../../services/torneo.service';

const equipoService = new EquipoService();
const torneoService = new TorneoService();

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

@Component({
  standalone: true,
  selector: 'app-equipos',
  imports: [CommonModule, FormsModule],
  templateUrl: './equipos.html',
  styleUrls: ['./equipos.css'],
})
export class Equipos implements OnInit {
  equipos: Equipo[] = [];
  torneos: Torneo[] = [];
  nombre = '';
  region = '';
  integrantes = 1;
  torneo_id = '';
  editId: string | null = null;
  mensaje = '';
  cargando = false;

  get token() {
    return isBrowser() ? window.localStorage.getItem('token') ?? '' : '';
  }

  get isEditing() {
    return this.editId !== null;
  }

  constructor() {}

  ngOnInit() {
    if (isBrowser()) {
      this.cargarDatos();
    }
  }

  async cargarDatos() {
    this.cargando = true;
    try {
      [this.equipos, this.torneos] = await Promise.all([
        equipoService.getAll(this.token),
        torneoService.getAll(this.token),
      ]);
    } catch (error) {
      this.mensaje = String(error);
    } finally {
      this.cargando = false;
    }
  }

  prepararEdicion(equipo: Equipo) {
    this.editId = equipo.id;
    this.nombre = equipo.nombre;
    this.region = equipo.region ?? '';
    this.integrantes = equipo.integrantes;
    this.torneo_id = equipo.torneo_id;
    this.mensaje = '';
  }

  async guardar() {
    this.mensaje = '';
    if (!this.nombre || !this.torneo_id) {
      this.mensaje = 'Nombre y torneo son obligatorios';
      return;
    }

    try {
      const payload: Partial<Equipo> = {
        nombre: this.nombre,
        region: this.region,
        integrantes: this.integrantes,
        torneo_id: this.torneo_id,
      };

      if (this.isEditing && this.editId) {
        await equipoService.update(this.editId, payload, this.token);
      } else {
        await equipoService.create(payload, this.token);
      }

      await this.cargarDatos();
      this.resetForm();
    } catch (error) {
      this.mensaje = String(error);
    }
  }

  async eliminar(id: string) {
    if (!confirm('Eliminar equipo?')) {
      return;
    }
    try {
      await equipoService.delete(id, this.token);
      await this.cargarDatos();
    } catch (error) {
      this.mensaje = String(error);
    }
  }

  resetForm() {
    this.editId = null;
    this.nombre = '';
    this.region = '';
    this.integrantes = 1;
    this.torneo_id = '';
    this.mensaje = '';
  }
}
