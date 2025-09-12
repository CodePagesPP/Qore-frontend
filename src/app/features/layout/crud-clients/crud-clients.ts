import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Client, RegisterRequest } from '../../../core/models/auth.model';
import { AdminService } from '../../../core/services/admin.service';
import { ClientService } from '../../../core/services/client.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crud-clients',
  imports: [CommonModule, FormsModule],
  templateUrl: './crud-clients.html',
  styleUrl: './crud-clients.css'
})
export class CrudClients implements OnInit{
  clients : Client[] = [];
  isModalOpen = false;
  isModalViewOpen = false;
  editingClient: Client | null = null;

  formData: Partial<RegisterRequest> = {
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
  };

  constructor(
   private adminService: AdminService,
   private clientService: ClientService
 ) {}
 
 ngOnInit() {
   this.loadClients();
 }
 
 
  loadClients() {
   this.adminService.getAllActiveClients().subscribe(
     data => {
       this.clients = data;
       
    
       this.clients.forEach(client => {
         if (client.id !== undefined) {
         } else {
           console.error('El ID del cliente es undefined:', client);
         }
       });
     },
     error => console.error(error)
   );
 }

 openAddModal(): void {
    this.editingClient = null;
    this.formData = {};
    this.isModalOpen = true;
  }

  openEditModal(client: Client): void {
    this.editingClient = client;
    this.formData = { ...client }; 
    this.isModalOpen = true;
  }

  openViewModal(client: Client): void {
    this.editingClient = null;
    this.formData = { ...client};
    this.isModalViewOpen = true
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  closeViewModal(): void {
    this.isModalViewOpen = false;
  }

  onSubmit(): void {
    if (this.editingClient) {
      
      this.clientService.updateClient(this.editingClient.dni, this.formData).subscribe({
        next: () => {
          this.loadClients();
          this.closeModal();
        },
        error: (err) => console.error('Error actualizando cliente', err)
      });
    } else {
    
      this.clientService.registerClient(this.formData as RegisterRequest).subscribe({
        next: () => {
          this.loadClients();
          this.closeModal();
        },
        error: (err) => console.error('Error registrando cliente', err)
      });
    }
  }

  deleteClient(id: string): void {
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => this.loadClients(),
        error: (err) => console.error('Error eliminando cliente', err)
      });
    }
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  birthdayError: string = '';
  dniError: string = '';
  validateBirthday(): void {
    const birthday = this.formData.birthday;

    if (!birthday) {
      this.birthdayError = '';
      return;
    }
    const actualDate = new Date();
    const receivedDate = new Date(birthday);
    if (receivedDate > actualDate) {
      this.birthdayError = 'La fecha es inválida.';
      return;
    }
    let age = actualDate.getFullYear() - receivedDate.getFullYear();
    const monthDiference = actualDate.getMonth() - receivedDate.getMonth();
    const dayDiference = actualDate.getDate() - receivedDate.getDate();

    if (monthDiference < 0 || (monthDiference === 0 && dayDiference < 0)) {
      age--;
    }
    if (age < 5) {
      this.birthdayError = 'La edad mínima es de 5 años.';
    } else {
      this.birthdayError = '';
    }
  }
}
