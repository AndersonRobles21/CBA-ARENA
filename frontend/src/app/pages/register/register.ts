import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  nombre = '';
  correo = '';
  password = '';
  errorMessage = '';
  private readonly authService = inject(AuthService);

  constructor(private router: Router) {}

  async registrar(): Promise<void> {
    this.errorMessage = '';

    try {
      await this.authService.register(this.nombre, this.correo, this.password);
      await this.router.navigate(['/login']);
    } catch (error) {
      this.errorMessage = String(error);
    }
  }
}
