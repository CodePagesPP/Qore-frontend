import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Discipline, Instructor, Role, UserProfile, workerRegisterRequest, workerUpdateRequest } from '../../../core/models/auth.model';
import { WorkersService } from '../../../core/services/workers.service';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { RolService } from '../../../core/services/rol.service';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-workers',
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './workers.html',
  styleUrl: './workers.css',
})
export class Workers implements OnInit {
  showModal = false;
  showModalView = false;
  edicion: workerUpdateRequest | null = null;
  roles: Role[] = [];
  formData: Partial<workerRegisterRequest> = {
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
    disciplineId: [],
    area: '',
    role: { id: 0, name: '' }
  };
  error: string | null = null;
  disciplines: Discipline[] = [];
  personal: { [key: string]: any[] } = {};
  userProfile: UserProfile | null = null;

  constructor(private workersService: WorkersService, private rolService: RolService, private adminService: AdminService) {}

  ngOnInit() {
    this.loadPersonal();
    this.loadRoles();
    this.loadDisciplines();
  }

  openModal() {
    this.showModal = true;
    this.edicion = null;
    this.formData = {
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
    disciplineId: [],
    area: '',
    role: { id: 0, name: '' }
  };
  }

  openEditModal(worker: any): void {
  this.edicion = worker;

  
  const matchedRole = this.roles.find(r => r.name.toUpperCase() === worker.role.toUpperCase());

  this.formData = {
    ...worker,
    role: matchedRole ? { id: matchedRole.id, name: matchedRole.name } : { id: 0, name: '' }
  };

  this.showModal = true;
  
}

  closeModal() {
    this.showModal = false;
  }

  closeModalView() {
    this.showModalView = false;
  }

  registerWorker() {
  const payload: workerRegisterRequest = {
    ...this.formData,
    roleId: Number(this.formData.role?.id), 
    disciplineId: Array.isArray(this.formData.disciplineId)
      ? this.formData.disciplineId.map(Number)
      : [Number(this.formData.disciplineId)],
  } as unknown as workerRegisterRequest;
 
  let request$: Observable<any>;

  switch (this.formData.role?.id) {
    case 3: 
      request$ = this.workersService.registerInstructor(payload);
      break;
    case 4: 
      request$ = this.workersService.registerStaff(payload);
      break;
    case 5: 
      request$ = this.workersService.registerManager(payload);
      break;
    default: 
      request$ = this.workersService.registerWorker(payload);
      break;
  }

  request$.subscribe({
    next: (res) => {
      console.log('Trabajador registrado con éxito:', res);
      this.error = null;
      this.closeModal();
      this.loadPersonal();
    },
    error: (err) => {
      console.error('Error al registrar trabajador:', err);
      this.error = err.error.message || 'Error desconocido al registrar';
    },
  });
}

  updateWorker() {
  const payload: workerUpdateRequest = {
    ...this.formData,
    role: {
      ...this.formData.role,
      id: Number(this.formData.role?.id) // forzar número
    },
    disciplineId: Array.isArray(this.formData.disciplineId)
      ? this.formData.disciplineId.map((id: any) => Number(id)) // ✅ map correcto
      : this.formData.disciplineId
        ? [Number(this.formData.disciplineId)]
        : [],
  } as workerUpdateRequest;

  console.log('Payload para actualizar:', payload);

  let request$: Observable<any>;

  switch (this.formData.role?.id) {
    case 3: // Instructor
      request$ = this.workersService.updateInstructor(payload.dni, payload);
      break;
    case 4: // Staff
      request$ = this.workersService.updateStaff(payload.dni, payload);
      break;
    case 5: // Manager
      request$ = this.workersService.updateManager(payload.dni, payload);
      break;
    default: // Otros roles
      request$ = this.workersService.updateWorker(payload.dni, payload);
      break;
  }

  request$.subscribe({
    next: (res) => {
      console.log('Trabajador actualizado con éxito:', res);
      this.error = null;
      this.closeModal();
      this.loadPersonal();
    },
    error: (err) => {
      console.error('Error al actualizar trabajador:', err);
      this.error = err.error.message || 'Error desconocido al actualizar';
    },
  });
}

  openViewModal(user: any): void {
  this.userProfile = user;
  const matchedRole = this.roles.find(r => r.name.toUpperCase() === user.role.toUpperCase());
  this.formData = {
    ...user,
    role: matchedRole ? { id: matchedRole.id, name: matchedRole.name } : { id: 0, name: '' }
  };
  this.showModalView = true;
}

deleteWorker(userId: string): void {
  if (confirm('¿Seguro que deseas eliminar este colaborador?')) {
      this.workersService.deleteWorker(userId).subscribe({
        next: () => this.loadPersonal(),
        error: (err) => console.error('Error eliminando cliente', err)
      });
    }
}

  onSubmit(): void {
    if(this.edicion) {
      this.updateWorker();
    } else {
      this.registerWorker();
    }
  }

  loadPersonal() {
    this.workersService.getPersonal().subscribe({
      next: (data) => {
        this.personal = data;
      },
      error: (err) => console.error(err),
    });
  }

  loadRoles() {
    this.rolService.getRolesNoClient().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => console.error(err),
    });
  }

  loadDisciplines() {
    this.workersService.getDisciplines().subscribe({
      next: (data) => {
        this.disciplines = data;
      },
      error: (err) => console.error(err),
    });
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
