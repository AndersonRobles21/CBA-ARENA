import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Torneo } from '../../interfaces';
import { TorneoService } from '../../services/torneo.service';

const service = new TorneoService();

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

@Component({
  standalone: true,
  selector: 'app-torneos',
  imports: [CommonModule, FormsModule],
  templateUrl: './torneos.html',
  styleUrls: ['./torneos.css'],
})
export class Torneos implements OnInit {
  torneos: Torneo[] = [];
  nombre = '';
  juego = '';
  descripcion = '';
  fecha_inicio = '';
  fecha_fin = '';
  estado: Torneo['estado'] = 'planeado';
  editId: string | null = null;
  mensaje = '';
  carga = false;

  get token() {
    return isBrowser() ? window.localStorage.getItem('token') ?? '' : '';
  }

  get isEditing() {
    return this.editId !== null;
  }

  constructor() {}

  ngOnInit() {
    if (isBrowser()) {
      this.cargarTorneos();
    }
  }

  async cargarTorneos() {
    this.carga = true;
    try {
      this.torneos = await service.getAll(this.token);
    } catch (error) {
      this.mensaje = String(error);
    } finally {
      this.carga = false;
    }
  }

  prepararEdicion(torneo: Torneo) {
    this.editId = torneo.id;
    this.nombre = torneo.nombre;
    this.juego = torneo.juego;
    this.descripcion = torneo.descripcion ?? '';
    this.fecha_inicio = torneo.fecha_inicio ?? '';
    this.fecha_fin = torneo.fecha_fin ?? '';
    this.estado = torneo.estado;
    this.mensaje = '';
  }

  async guardar() {
    this.mensaje = '';
    if (!this.nombre || !this.juego) {
      this.mensaje = 'Nombre y juego son obligatorios';
      return;
    }

    try {
      const entrada: Partial<Torneo> = {
        nombre: this.nombre,
        juego: this.juego,
        descripcion: this.descripcion,
        fecha_inicio: this.fecha_inicio,
        fecha_fin: this.fecha_fin,
        estado: this.estado,
      };

      if (this.isEditing && this.editId) {
        await service.update(this.editId, entrada, this.token);
      } else {
        await service.create(entrada, this.token);
      }

      await this.cargarTorneos();
      this.resetForm();
    } catch (error) {
      this.mensaje = String(error);
    }
  }

  async eliminar(id: string) {
    if (!confirm('Eliminar torneo?')) {
      return;
    }
    try {
      await service.delete(id, this.token);
      await this.cargarTorneos();
    } catch (error) {
      this.mensaje = String(error);
    }
  }

  resetForm() {
    this.editId = null;
    this.nombre = '';
    this.juego = '';
    this.descripcion = '';
    this.fecha_inicio = '';
    this.fecha_fin = '';
    this.estado = 'planeado';
    this.mensaje = '';
  }
}
