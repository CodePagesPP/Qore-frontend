import { Component, ViewChild } from '@angular/core';
import { ClassSession, Room } from '../../../core/models/class.model';
import { Discipline, Instructor } from '../../../core/models/auth.model';
import { ClassSessionService } from '../../../core/services/class-session.service';
import { WorkersService } from '../../../core/services/workers.service';
import { AuthService } from '../../../core/services/auth.service';
import { InstructorService } from '../../../core/services/instructor.service';
import { CalendarComponent, CalendarModule } from 'smart-webcomponents-angular/calendar';
import { RadioButtonComponent, RadioButtonModule } from 'smart-webcomponents-angular/radiobutton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clases-client',
  imports: [CommonModule, FormsModule, CalendarModule, RadioButtonModule],
  templateUrl: './clases-client.html',
  styleUrl: './clases-client.css'
})
export class ClasesClient {
  clases: ClassSession[] = [];

  disciplines: Discipline[] = [];
  instructors: Instructor[] = [];
  rooms: Room[] = [];
currentClientId!: number;
selectedClass?: ClassSession;
comentario: string = '';
showModal = false;

confirmJoinModal = false;
  successModal = false;

  constructor(
    private classService: ClassSessionService,
    private workerService: WorkersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
     this.authService.getUserInfo().subscribe({
      next: (profile: any) => {
        this.currentClientId = profile.id; // asumiendo que en el token viene el ID del instructor
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

openJoinModal(clase: ClassSession) {
    this.selectedClass = clase;
    this.confirmJoinModal = true;
  }

  // Cancelar
  closeJoinModal() {
    this.confirmJoinModal = false;
    this.selectedClass = undefined;
  }

  // Confirmar unión
 confirmJoin() {
  if (!this.selectedClass || this.selectedClass.id === undefined) {
    console.error('Clase inválida o sin ID');
    return;
  }

  this.authService.getUserInfo().subscribe(profile => {
    const clientId = profile.id;

    this.classService.joinClass(this.selectedClass!.id!, clientId).subscribe({
      next: (res) => {
        console.log(res.message);

        // marcar como inscrito en UI
        this.selectedClass!.joined = true;

        this.confirmJoinModal = false;
        this.successModal = true;
      },
      error: (err) => console.error('Error al unirse a la clase', err)
    });
  });
}


  closeSuccessModal() {
    this.successModal = false;
  }




  loadClases() {
 this.classService.getClientByDiscipline(this.currentClientId)
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

clearFilter() {
  this.selectedDate = null;       
  this.calendarView = 'month';  
  this.filteredByDate = [...this.clases];
  if (this.calendar) {
    this.calendar.clearSelection(); 
  }
}
}
