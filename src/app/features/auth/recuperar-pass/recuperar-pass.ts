import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthRequest } from '../../../core/models/auth.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-recuperar-pass',
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperar-pass.html',
  styleUrl: './recuperar-pass.css'
})
export class RecuperarPass {
  @Input() showModalRecovery = false;
  @Output() close = new EventEmitter<void>();

  email = '';
  error: string | null = null;
  success: string | null = null;
  loading = false; 

  constructor(private authService: AuthService) {}

  onClose() {
    this.close.emit();
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.loading = true; 
    this.error = null;
    this.success = null;

    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.success = res.message;
        this.error = null;
        this.email = '';
        this.loading = false; 
      },
      error: (err) => {
        this.error = err.error?.error || 'Ocurrió un error';
        this.success = null;
        this.loading = false;
      }
    });
  }
  
}
