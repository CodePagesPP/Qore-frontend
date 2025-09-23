import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthRequest, RegisterRequest } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecuperarPass } from '../recuperar-pass/recuperar-pass';

@Component({
  selector: 'app-login.component',
  imports: [CommonModule, FormsModule, RecuperarPass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials: AuthRequest = { email: '', password: '' };
  error: string | null = null;
  showRecoveryModal = false;

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
        this.router.navigate(['/c/dashboard']);
      }else if (roles.includes('INSTRUCTOR_ACCESS')) {
        this.router.navigate(['/i/dashboard']);
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

//Registro

  credentialsRegister: RegisterRequest = {
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

  birthdayError: string = '';
  emailError: string = '';
  dniError: string = '';

  onSubmitRegister(): void {
    this.authService.register(this.credentialsRegister).subscribe({
      next: (res) => {
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        console.log('Error recibido:', err.error.message);
        this.error = err.error.message;
        this.cdRef.detectChanges();
      }
    })
  }

  validateBirthday():void{
    const actualDate = new Date();
    const receivedDate = new Date(this.credentialsRegister.birthday);
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

goBack() {
  // si usas routing de Angular
  this.router.navigate(['/home']); 
  // o simplemente window.history.back();
}

openModal() {
  this.showRecoveryModal = true;
}

closeModal() {
  this.showRecoveryModal = false;
}
}
