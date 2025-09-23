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



  constructor(
    private classService: ClassSessionService,
    private workerService: WorkersService,
    private authService: AuthService
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

  calendarView: 'landscape' | 'portrait' = 'landscape';

setView(view: 'landscape' | 'portrait') {
  this.calendarView = view;
}

selectedDate: string | null = null; // YYYY-MM-DD
filteredByDate: any[] = [];

onDateSelect(event: any) {
  const selected = event.detail.value; // array de Date
  if (selected && selected.length > 0) {
    const dateObj: Date = selected[0]; // tomamos la primera fecha
    const dateStr = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
    this.selectedDate = dateStr;

    this.filteredByDate = this.clases.filter(c => c.startDate === dateStr);
  }
}

}
