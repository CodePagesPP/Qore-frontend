import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Discipline, Instructor, Role, workerRegisterRequest, workerUpdateRequest } from '../../../core/models/auth.model';
import { WorkersService } from '../../../core/services/workers.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-workers',
  imports: [CommonModule, FormsModule],
  templateUrl: './workers.html',
  styleUrl: './workers.css',
})
export class Workers implements OnInit {
  showModal = false;
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

  constructor(private workersService: WorkersService) {}

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

  openEditModal(worker: workerRegisterRequest): void {
    this.edicion = worker;
    this.formData = {...worker};
    this.showModal = true;
    console.log('formData:', this.formData)
  }

  closeModal() {
    this.showModal = false;
  }

  registerWorker() {
    const payload: workerRegisterRequest = {
      ...this.formData,
      disciplineId: this.formData.disciplineId
        ? [Number(this.formData.disciplineId)]
        : [],
    } as workerRegisterRequest;

    
    console.log(payload);

    if (this.formData.role?.id == 3) {
      this.workersService.registerInstructor(payload).subscribe({
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
    } else if (this.formData.role?.id == 4) {
      this.workersService.registerStaff(payload).subscribe({
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
    } else if (this.formData.role?.id == 5) {
      this.workersService.registerManager(payload).subscribe({
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
    } else {
      this.workersService.registerWorker(payload).subscribe({
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
  }

  updateWorker() {
    const payload: workerUpdateRequest = {
      ...this.formData,
      disciplineId: this.formData.disciplineId
        ? [Number(this.formData.disciplineId)]
        : [],
    } as workerUpdateRequest;

    console.log('payload:', payload);
    if (this.formData.role?.id == 3) {
      this.workersService.updateStaff(payload.dni, payload).subscribe({
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
    this.workersService.getRolesNoClient().subscribe({
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
