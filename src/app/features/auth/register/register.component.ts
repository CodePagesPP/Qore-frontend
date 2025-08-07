import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthRequest, RegisterRequest } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register.component',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  credentials: RegisterRequest = {
    email: '',
    password: '',
    name: '',
    lastName: '',
    phoneNumber: '',
    birthday: '',
    sex: '',
    country: '',
    city: '',
    address: '',
    dni: ''
  }
  error: string | null = null;

  birthdayError: string = '';
  emailError: string = '';
  dniError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.register(this.credentials).subscribe({
      next: (res) => {
        alert('cliente registrado');
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        console.log('Error recibido:', err);
        const message = err.error?.message || '';

        this.emailError = '';
        this.dniError = '';
        this.error = '';

        if (message.includes('dni')) {
          this.dniError = message;
        } else if (message.includes('email')) {
          this.emailError = message;
        } else {
          this.error = 'No se pudo registrar al usuario.';
        }
      }
    })
  }

  validateBirthday():void{
    const actualDate = new Date();
    const receivedDate = new Date(this.credentials.birthday);
    if(receivedDate > actualDate) {
      this.birthdayError = 'La fecha es inválida.';
      return;
    }
    let age = actualDate.getFullYear() - receivedDate.getFullYear();
    const monthDiference = actualDate.getMonth() - receivedDate.getMonth();
    const dayDiference = actualDate.getDate() - receivedDate.getDate();

    if(monthDiference < 0 || (monthDiference === 0 && dayDiference < 0)) {
      age--;
    }
    if(age < 5) {
      this.birthdayError = 'La edad mínima es de 5 años.';
    } else {
      this.birthdayError = '';
    }
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
  const charCode = event.key.charCodeAt(0);
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}

}
