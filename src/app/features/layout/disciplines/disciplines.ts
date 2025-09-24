import { Component, OnInit } from '@angular/core';
import { Discipline } from '../../../core/models/auth.model';
import { DisciplineService } from '../../../core/services/discipline.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-disciplines',
  imports: [FormsModule, CommonModule],
  templateUrl: './disciplines.html',
  styleUrl: './disciplines.css'
})
export class Disciplines implements OnInit{
disciplines: Discipline[] = [];
  currentDiscipline: Discipline = { name: '', description: '', endTime: '', startTime:''};
  isEditing = false;

  // Modal
  isModalOpen = false;

  constructor(private disciplineService: DisciplineService) {}

  ngOnInit(): void {
    this.loadDisciplines();
  }

  loadDisciplines() {
    this.disciplineService.getAll().subscribe(data => this.disciplines = data);
  }

  openModal(discipline?: Discipline) {
    if (discipline) {
      this.currentDiscipline = { ...discipline };
      this.isEditing = true;
    } else {
      this.currentDiscipline = { name: '', description: '', endTime: '', startTime:'' };
      this.isEditing = false;
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.currentDiscipline = { name: '', description: '' , endTime: '', startTime:''};
    this.isEditing = false;
  }

  saveDiscipline() {
  if (this.isEditing && this.currentDiscipline.id) {
    this.disciplineService.update(this.currentDiscipline.id, this.currentDiscipline).subscribe({
      next: () => {
        this.loadDisciplines();
        this.closeModal();
      },
      error: (err) => {
        if (err.error?.message) {
          alert(`Error al actualizar: ${err.error.message}`);
        } else {
          alert('Ocurrió un error inesperado al actualizar la disciplina.');
        }
      }
    });
  } else {
    this.disciplineService.create(this.currentDiscipline).subscribe({
      next: () => {
        this.loadDisciplines();
        this.closeModal();
      },
      error: (err) => {
        if (err.error?.message) {
          alert(`Error al crear: ${err.error.message}`);
        } else {
          alert('Ocurrió un error inesperado al crear la disciplina.');
        }
      }
    });
  }
}

  deleteDiscipline(id: number) {
  if (confirm('¿Seguro que deseas eliminar esta disciplina?')) {
    this.disciplineService.delete(id).subscribe({
      next: () => this.loadDisciplines(),
      error: (err) => {
        if (err.error?.message) {
          alert(err.error.message); 
        } else {
          alert('Ocurrió un error inesperado al eliminar la disciplina.');
        }
      }
    });
  }
}
}
