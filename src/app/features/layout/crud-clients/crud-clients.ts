import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Client, Discipline, RegisterRequest } from '../../../core/models/auth.model';
import { AdminService } from '../../../core/services/admin.service';
import { ClientService } from '../../../core/services/client.service';
import { FormsModule } from '@angular/forms';
import { ExcelService } from '../../../core/services/excel.service';
import { DisciplineService } from '../../../core/services/discipline.service';

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
  allDisciplines: Discipline[]=[];
  formData: any = {
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
    dni: '',
    disciplinesIds: []   
  };

isConfirmationOpen: boolean = false;
confirmationMessage: string = '';
confirmationType: 'success' | 'error' = 'success';



  constructor(
   private adminService: AdminService,
   private clientService: ClientService,
   private excelService: ExcelService,
   private disciplineService: DisciplineService
 ) {}
 
 ngOnInit() {
   this.loadClients();
   this.loadDisciplines();
 }

 toggleDiscipline(id: number, event: any): void {
  if (event.target.checked) {
    if (!this.formData.disciplinesIds.includes(id)) {
      this.formData.disciplinesIds.push(id);
    }
  } else {
    this.formData.disciplinesIds = this.formData.disciplinesIds.filter((d: number) => d !== id);
  }
}


downloadClientsExcel() {
  this.excelService.downloadClientsExcel().subscribe((blob: Blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all-clients.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  });
}

loadDisciplines() {
  this.disciplineService.getAll().subscribe({
    next: (data) => this.allDisciplines = data,
    error: (err) => console.error('Error cargando disciplinas', err)
  });
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

 updateTrialStatus(client: any) {
  this.clientService.updateTrialStatus(client.id, client.trialCompleted).subscribe({
    next: () => {
      console.log(`Clase de prueba actualizada para ${client.name}`);
    },
    error: (err) => {
      console.error('Error al actualizar clase de prueba', err);
    }
  });
}


 openAddModal(): void {
    this.editingClient = null;
    this.formData = {};
    this.isModalOpen = true;
  }

openEditModal(client: Client): void {
  this.editingClient = client;
  this.formData = { ...client, disciplinesIds: client.disciplines?.map(d => d.id) || [] };
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
  const payload = {
    ...this.formData,
    disciplineIds: this.formData.disciplinesIds
  };

  if (this.editingClient) {
    this.clientService.updateClient(this.editingClient.dni, payload).subscribe({
      next: () => {
        this.loadClients();
        this.closeModal();
        this.showConfirmation('Cliente actualizado correctamente', 'success');
      },
      error: (err) => this.handleHttpError(err, 'actualizar')
    });
  } else {
    this.clientService.registerClient(payload as RegisterRequest).subscribe({
      next: () => {
        this.loadClients();
        this.closeModal();
        this.showConfirmation('Cliente registrado correctamente', 'success');
      },
      error: (err) => this.handleHttpError(err, 'registrar')
    });
  }
}


private handleHttpError(err: any, action: string): void {
  let msg = 'Error inesperado al ' + action + ' el cliente';

  if (err.error?.message) {
    msg = err.error.message; 
  } else if (err.message) {
    msg = err.message;
  }

  this.showConfirmation(msg, 'error');
}



showConfirmation(message: string, type: 'success' | 'error' = 'success'): void {
  this.confirmationMessage = message;
  this.confirmationType = type;
  this.isConfirmationOpen = true;
}

closeConfirmation(): void {
  this.isConfirmationOpen = false;
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

searchTerm: string = '';

  filteredClients() {
  if (!this.searchTerm || this.searchTerm.trim() === '') {
    return this.clients;
  }

  return this.clients.filter(c =>
    c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
    c.dni.includes(this.searchTerm)
  );
}

onSearchChange() {
  this.currentPage = 1; // reinicia siempre a la primera página
}

  // Parámetros de paginación
  currentPage: number = 1;
  itemsPerPage: number = 10; // clientes por página

  get paginatedClients() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;

  return this.filteredClients().slice(startIndex, endIndex);
}


  get totalPages() {
    return Math.ceil(this.filteredClients().length / this.itemsPerPage);
  }
}