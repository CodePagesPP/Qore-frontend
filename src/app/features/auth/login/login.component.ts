import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthRequest } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login.component',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials: AuthRequest = { email: '', password: '' };
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router, private cdRef: ChangeDetectorRef) {}

  isActive = false;

  activateRegister() {
    this.isActive = true;
  }

  activateLogin() {
    this.isActive = false;
  }
onSubmit(): void {
  this.authService.login(this.credentials).subscribe({
    next: (res) => {
      localStorage.setItem('token', res.token);

      const roles = this.authService.getAuthorities();

      if (roles.includes('ADMIN_ACCESS')) {
        this.router.navigate(['/dashboard']);
      } else if (roles.includes('CLIENT_ACCESS')) {
        this.router.navigate(['/c/dashboard-client']);
      } else {
        this.router.navigate(['/home']);
      }
    },
    error: (err) => {
      this.error = err.message; 
      this.cdRef.detectChanges();
    },
  });
}
}
