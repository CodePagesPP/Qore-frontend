import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Discipline, Instructor, Manager, Staff } from '../../../core/models/auth.model';
import { WorkersService } from '../../../core/services/workers.service';

@Component({
  selector: 'app-workers',
  imports: [CommonModule],
  templateUrl: './workers.html',
  styleUrl: './workers.css'
})
export class Workers implements OnInit{
  staffs: Staff[] = [];
  managers: Manager[] = [];
  instructors: Instructor[] = [];
  disciplines: Discipline[] = [];
  personal: { [key: string]: any[] } = {};

  constructor(private workersService: WorkersService) {}

  ngOnInit() {
    this.loadPersonal();
  }

  loadPersonal() {
    this.workersService.getPersonal().subscribe({
      next: (data) => {
        this.personal = data;
        console.log(this.personal)
      },
      error: (err) => console.error(err)
    });
  }


   loadStaff() {
    this.workersService.getStaff().subscribe(
      data => {
        this.staffs = data;

        this.staffs.forEach(staff => {
          if(staff.id !== undefined) {
          } else {
              console.error('El ID del staff es undefined:', staff);
            }
        });
      },
      error => console.error(error)
    )
   }

   loadManagers() {
    this.workersService.getManager().subscribe(
      data => {
        this.managers = data;

        this.managers.forEach(manager => {
          if(manager.id !== undefined){
          } else {
            console.error('El ID del manager es undefined:', manager);
          }
        });
      },
       error => console.error(error)
    );
  }

  loadInstructors() {
    this.workersService.getInstructor().subscribe(
      data => {
        this.instructors = data;

        this.instructors.forEach(instructor => {
          if(instructor.id !== undefined){
          } else {
            console.error('El ID del instructor es undefined:', instructor);
          }
        });
      },
       error => console.error(error)
    );
  }

  loadDisciplines() {
    this.workersService.getDisciplines().subscribe(
      data => {
        this.disciplines = data;

        this.disciplines.forEach(discipline => {
          if(discipline.id !== undefined){
          } else {
            console.error('El ID de la disciplina es undefined:', discipline);
          }
        });
      },
       error => console.error(error)
    );
  }

  getDisciplineNames(ids: number[]): string {
    return this.disciplines
      .filter(d => ids.includes(d.id))
      .map(d => d.name)
      .join(', ')
  }
}
