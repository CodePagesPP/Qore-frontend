import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit{
token = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  error = '';
  loading = false; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true; 
    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (res) => {
        this.message = res.message;
        this.error = '';
        
        setTimeout(() => {
          this.router.navigate(['/login']);
          this.loading = false; 
        }, 3000);
      },
      error: (err) => {
        this.error = err.error?.error || 'Ocurrió un error';
        this.message = '';
        this.loading = false; 
      }
    });
  }
}
