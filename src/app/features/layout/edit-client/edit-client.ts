import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { AuthService } from '../../../core/services/auth.service';
import { Client, User } from '../../../core/models/auth.model';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-edit-client',
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './edit-client.html',
  styleUrl: './edit-client.css'
})
export class EditClient implements OnInit {
formData: Partial<Client> = {};

  currentClientId?: string;
  clientInfo?: Client;
  birthdayError: string = '';
  dni!: string;

  constructor(
    private clientService: ClientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe({
      next: (profile: User) => {
        this.currentClientId = profile.dni;
        this.clientService.getClientById(profile.dni).subscribe(client => {
          this.clientInfo = client;
          this.formData = { ...client }; // clonar los datos
        });
      },
      error: (err) => console.error('Error al obtener perfil', err),
    });
  }

  onSubmit(): void {
  if (!this.formData.dni) {
    alert('No se pudo obtener el DNI del usuario');
    return;
  }

    this.clientService.updateClient(this.formData.dni, this.formData).subscribe({
      next: () => alert('Perfil actualizado correctamente'),
      error: () => alert('Hubo un error al actualizar el perfil')
    });
  }

  validateBirthday(): void {
    if (this.formData.birthday) {
      const birthDate = new Date(this.formData.birthday);
      const today = new Date();
      if (birthDate >= today) {
        this.birthdayError = 'La fecha de nacimiento no puede ser futura';
      } else {
        this.birthdayError = '';
      }
    }
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const key = event.key;
    if (!/[\d]/.test(key)) {
      event.preventDefault();
    }
  }
}
