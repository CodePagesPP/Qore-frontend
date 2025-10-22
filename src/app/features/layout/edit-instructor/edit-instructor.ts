import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Instructor, User } from '../../../core/models/auth.model';
import { InstructorService } from '../../../core/services/instructor.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-edit-instructor',
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './edit-instructor.html',
  styleUrl: './edit-instructor.css'
})
export class EditInstructor implements OnInit{
formData: Partial<Instructor> = {};

  currentInstructorId?: string;
  instructorInfo?: Instructor;
  birthdayError: string = '';
  dni!: string;

  constructor(
    private instructorService: InstructorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe({
      next: (profile: User) => {
        this.currentInstructorId = profile.dni;
        this.instructorService.getInstructorById(profile.dni).subscribe(instructor => {
          this.instructorInfo = instructor;
          this.formData = { ...instructor }; // clonar los datos
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

    this.instructorService.updateInstructor(this.formData.dni, this.formData).subscribe({
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
