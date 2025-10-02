import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  CalendarComponent, CalendarModule } from 'smart-webcomponents-angular/calendar';
import {  RadioButtonComponent, RadioButtonModule } from 'smart-webcomponents-angular/radiobutton';
import { ClassSession, Room} from '../../../core/models/class.model';
import { ClassSessionService } from '../../../core/services/class-session.service';
import { AuthService } from '../../../core/services/auth.service';
import { WorkersService } from '../../../core/services/workers.service';
import { Discipline, Instructor } from '../../../core/models/auth.model';
import { InstructorService } from '../../../core/services/instructor.service';

@Component({
  selector: 'app-clases-instructor',
  imports: [CommonModule, FormsModule, CalendarModule, RadioButtonModule],
  templateUrl: './clases-instructor.html',
  styleUrl: './clases-instructor.css'
})
export class ClasesInstructor implements OnInit{
clases: ClassSession[] = [];

  disciplines: Discipline[] = [];
  instructors: Instructor[] = [];
  rooms: Room[] = [];
currentInstructorId!: number;
selectedClass?: ClassSession;
comentario: string = '';
showModal = false;



  constructor(
    private classService: ClassSessionService,
    private workerService: WorkersService,
    private authService: AuthService,
    private instructorService: InstructorService
  ) {}

  ngOnInit(): void {
     this.authService.getUserInfo().subscribe({
      next: (profile: any) => {
        this.currentInstructorId = profile.id; // asumiendo que en el token viene el ID del instructor
        // 2. Carga las clases
        this.loadClases();
      },
      error: (err) => console.error('Error al obtener perfil', err),
    });
    this.loadCatalogs();
  }

  openModal(classSession: ClassSession) {
  this.selectedClass = classSession;
  this.comentario = classSession.comentario || '';
  this.showModal = true;
}

saveComentario() {
  if (!this.selectedClass) return;

  this.instructorService.updateComentario(this.selectedClass.id!, this.comentario)
  .subscribe({
    next: (updated) => {
      this.selectedClass!.comentario = updated.comentario;
      this.showModal = false;
    },
    error: (err) => console.error('Error guardando comentario', err)
  });
}



  loadClases() {
 this.classService.getByInstructor(this.currentInstructorId)
      .subscribe({
        next: (data) => {
          this.clases = data;
          
        },
        error: (err) => console.error('Error al cargar clases', err)
      });
  }




  loadCatalogs() {
    
    this.classService.getRooms().subscribe(rs => this.rooms = rs);
    this.workerService.getDisciplines().subscribe(ds => this.disciplines = ds);
    this.workerService.getInstructors().subscribe(is => this.instructors = is);
  }

  getDisciplineName(id: number): string {
  const discipline = this.disciplines?.find(d => d.id === id);
  return discipline ? discipline.name : id.toString();
}

getInstructorName(id: number): string {
  const instructor = this.instructors?.find(i => i.id === id);
  return instructor ? instructor.name : id.toString();
}

getRoomName(id: number): string {
  const room = this.rooms?.find(r => r.id === id);
  return room ? room.name : id.toString();
}


  @ViewChild('calendar', { static: false }) calendar!: CalendarComponent;
  @ViewChild('landscape', { static: false }) landscape!: RadioButtonComponent;
  @ViewChild('portrait', { static: false }) portrait!: RadioButtonComponent;

  ngAfterViewInit(): void {
    this.init();
  }

  init(): void {
  this.landscape.addEventListener('change', () => {
    if (this.landscape.checked) {
      this.calendar.nativeElement.view = 'landscape';
    }
  });

  this.portrait.addEventListener('change', () => {
    if (this.portrait.checked) {
      this.calendar.nativeElement.view = 'portrait';
    }
  });
  }

  calendarView: 'week' | 'month' = 'month';

setView(view: 'week' | 'month') {
  this.calendarView = view;
  this.filterClases();
}

selectedDate: string | null = null; // YYYY-MM-DD
filteredByDate: any[] = [];

onDateSelect(event: any) {
  const selected = event.detail.value; // array de Date
  if (selected && selected.length > 0) {
    const dateObj: Date = selected[0]; 
    this.selectedDate = dateObj.toISOString().split('T')[0]; 
    this.filterClases();
  }
}

filterClases() {
  if (!this.selectedDate) {
    this.filteredByDate = [];
    return;
  }

  const dateObj = new Date(this.selectedDate);

  if (this.calendarView === 'week') {
    // Calcular rango de semana (lunes a domingo, por ejemplo)
    const firstDay = new Date(dateObj);
    firstDay.setDate(dateObj.getDate() - dateObj.getDay() + 1); // lunes
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6); // domingo

    this.filteredByDate = this.clases.filter(c => {
      const classDate = new Date(c.startDate);
      return classDate >= firstDay && classDate <= lastDay;
    });

  } else if (this.calendarView === 'month') {
    // Filtrar por mes
    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();

    this.filteredByDate = this.clases.filter(c => {
      const classDate = new Date(c.startDate);
      return classDate.getMonth() === month && classDate.getFullYear() === year;
    });
  }
}

}
