import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Partida, Equipo, Torneo } from '../../interfaces';
import { PartidaService } from '../../services/partida.service';
import { TorneoService } from '../../services/torneo.service';
import { EquipoService } from '../../services/equipo.service';

const partidaService = new PartidaService();
const torneoService = new TorneoService();
const equipoService = new EquipoService();

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

@Component({
  standalone: true,
  selector: 'app-partidas',
  imports: [CommonModule, FormsModule],
  templateUrl: './partidas.html',
  styleUrls: ['./partidas.css'],
})
export class Partidas implements OnInit {
  partidas: Partida[] = [];
  torneos: Torneo[] = [];
  equipos: Equipo[] = [];
  torneo_id = '';
  equipo_a_id = '';
  equipo_b_id = '';
  fecha = '';
  resultado = '';
  estado: Partida['estado'] = 'pendiente';
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
      this.cargarTodo();
    }
  }

  async cargarTodo() {
    this.cargando = true;
    try {
      const [partidas, torneos, equipos] = await Promise.all([
        partidaService.getAll(this.token),
        torneoService.getAll(this.token),
        equipoService.getAll(this.token),
      ]);
      this.partidas = partidas;
      this.torneos = torneos;
      this.equipos = equipos;
    } catch (error) {
      this.mensaje = String(error);
    } finally {
      this.cargando = false;
    }
  }

  prepararEdicion(partida: Partida) {
    this.editId = partida.id;
    this.torneo_id = partida.torneo_id;
    this.equipo_a_id = partida.equipo_a_id;
    this.equipo_b_id = partida.equipo_b_id;
    this.fecha = partida.fecha ?? '';
    this.resultado = partida.resultado ?? '';
    this.estado = partida.estado;
    this.mensaje = '';
  }

  async guardar() {
    if (!this.torneo_id || !this.equipo_a_id || !this.equipo_b_id) {
      this.mensaje = 'Debes seleccionar torneo y ambos equipos';
      return;
    }
    if (this.equipo_a_id === this.equipo_b_id) {
      this.mensaje = 'Los equipos deben ser diferentes';
      return;
    }

    try {
      const payload: Partial<Partida> = {
        torneo_id: this.torneo_id,
        equipo_a_id: this.equipo_a_id,
        equipo_b_id: this.equipo_b_id,
        fecha: this.fecha,
        resultado: this.resultado,
        estado: this.estado,
      };
      if (this.isEditing && this.editId) {
        await partidaService.update(this.editId, payload, this.token);
      } else {
        await partidaService.create(payload, this.token);
      }
      await this.cargarTodo();
      this.resetForm();
    } catch (error) {
      this.mensaje = String(error);
    }
  }

  async eliminar(id: string) {
    if (!confirm('Eliminar partida?')) {
      return;
    }
    try {
      await partidaService.delete(id, this.token);
      await this.cargarTodo();
    } catch (error) {
      this.mensaje = String(error);
    }
  }

  resetForm() {
    this.editId = null;
    this.torneo_id = '';
    this.equipo_a_id = '';
    this.equipo_b_id = '';
    this.fecha = '';
    this.resultado = '';
    this.estado = 'pendiente';
    this.mensaje = '';
  }
}
