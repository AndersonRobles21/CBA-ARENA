import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  correo = '';
  password = '';
  errorMessage = '';
  private readonly authService = inject(AuthService);

  constructor(private router: Router) {}

  async login(): Promise<void> {
    this.errorMessage = '';

    try {
      await this.authService.login(this.correo, this.password);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.errorMessage = String(error);
    }
  }
}
