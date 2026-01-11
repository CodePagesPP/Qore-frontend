import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CalendarModule } from 'smart-webcomponents-angular/calendar';
import { RadioButtonModule } from 'smart-webcomponents-angular/radiobutton';
import { ClassSession, Room} from '../../../core/models/class.model';
import { ClassSessionService } from '../../../core/services/class-session.service';
import { AuthService } from '../../../core/services/auth.service';
import { WorkersService } from '../../../core/services/workers.service';
import { Client, Discipline, Instructor } from '../../../core/models/auth.model';
import { InstructorService } from '../../../core/services/instructor.service';
import { addDays, format, startOfWeek, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-clases-instructor',
  imports: [CommonModule, FormsModule, CalendarModule, RadioButtonModule],
  templateUrl: './clases-instructor.html',
  styleUrl: './clases-instructor.css'
})
export class ClasesInstructor implements OnInit{
clases: ClassSession[] = [];
weekDays: Date[] = [];
  disciplines: Discipline[] = [];
  instructors: Instructor[] = [];
  rooms: Room[] = [];
currentInstructorId!: number;
selectedClass?: ClassSession;
comentario: string = '';
showModal = false;
 searchText: string = '';
  selectedDisciplineId: number | null = null;
  selectedInstructorId: number | null = null;
currentDate: Date = new Date();
  filteredClases: ClassSession[] = [];
showClientsModal = false;
clients: Client[] = [];
errorMessage: string = '';
showErrorModal: boolean = false;
isLoading: boolean = false;
showSuccessModal: boolean = false;
showCalendar = false;
selectedDate: string = '';


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
    this.generateWeek();
  }

    toggleCalendar() {
  this.showCalendar = !this.showCalendar;
}


goToSelectedDate() {
  if (!this.selectedDate) return;

  // Convertimos el string "YYYY-MM-DD" a Date
  this.currentDate = new Date(this.selectedDate + 'T00:00:00');

  this.generateWeek();
  this.showCalendar = false;
}

  openModal(classSession: ClassSession) {
  this.selectedClass = classSession;
 
  this.comentario = classSession.comentario ? classSession.comentario:  '';
  
  this.showModal = true;
}

  getClassesForDay(day: Date): ClassSession[] {
    // Filtra el array principal de clases
    return this.clases.filter((clase) => {
      // Compara si la fecha de la clase (sin la hora) es igual a la del día que se está renderizando
      const parts = clase.startDate.split('-');
      const claseDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));

      return claseDate.toDateString() === day.toDateString();
    });
  }

    clearFilters() {
    // Reseteamos los valores de los filtros
    this.searchText = '';
    this.selectedDisciplineId = null;
    this.selectedInstructorId = null;
    
    // Aplicamos los filtros para que se muestren todas las clases de nuevo
    this.applyFilters();
  }

   applyFilters() {
    // 1. Empezamos con la lista completa de clases
    let tempClases = [...this.clases];

    // 2. Filtramos por texto de búsqueda (si hay algo escrito)
    if (this.searchText) {
      tempClases = tempClases.filter(clase =>
        clase.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    // 3. Filtramos por disciplina (si se ha seleccionado una)
    if (this.selectedDisciplineId) {
      tempClases = tempClases.filter(clase => clase.disciplineId === this.selectedDisciplineId);
    }

    // 4. Filtramos por instructor (si se ha seleccionado uno)
    if (this.selectedInstructorId) {
      tempClases = tempClases.filter(clase => clase.instructorId === this.selectedInstructorId);
    }

    // 5. Actualizamos la lista de clases que se mostrará en la vista
    this.filteredClases = tempClases;
  }

    previousWeek() {
      // Restamos 7 días (una semana)
      this.currentDate = subDays(this.currentDate, 7);
      this.generateWeek();
    }
  
    nextWeek() {
      // Sumamos 7 días
      this.currentDate = addDays(this.currentDate, 7);
      this.generateWeek();
    }

    generateWeek() {
    const monday = startOfWeek(this.currentDate, { weekStartsOn: 1 });
    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      this.weekDays.push(addDays(monday, i));
    }
    
    // Cada vez que cambiamos de semana, recargamos los datos
    this.loadClases();
  }

  trackByFn(index: number, item: ClassSession): number {
    return item.id!;
  }


        getWeekTitle(): string {
          if (this.weekDays.length === 0) return '';
          const start = this.weekDays[0];
          const end = this.weekDays[6];
          // Ejemplo: "6 de octubre - 12 de octubre, 2025"
          return `${format(start, "d 'de' MMMM", { locale: es })} - ${format(
            end,
            "d 'de' MMMM, y",
            { locale: es }
          )}`;
        }
      

saveComentario() {
  if (!this.selectedClass) return;

  this.isLoading = true; // Mostrar modal de carga

  this.instructorService.updateComentario(this.selectedClass.id!, this.comentario)
    .subscribe({
      next: (updated) => {
        // Actualiza localmente
        this.selectedClass!.comentario = updated.comentario;

        const index = this.clases.findIndex(c => c.id === this.selectedClass!.id);
        if (index !== -1) {
          this.clases[index].comentario = updated.comentario;
        }

        // Oculta el modal de comentario y el loader
        this.isLoading = false;
        this.showModal = false;

        // Muestra el modal de éxito
        this.showSuccessModal = true;
      },
      error: (err) => {
       

        this.isLoading = false;
        this.showModal = false;

        if (typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Ocurrió un error al guardar el comentario.';
        }

        this.showErrorModal = true;
      }
    });
}


  loadClases() {
    if (!this.currentInstructorId) return;

    
    const start = startOfWeek(this.currentDate, { weekStartsOn: 1 });
    const end = addDays(start, 6);
    
    
    const startStr = format(start, 'yyyy-MM-dd');
    const endStr = format(end, 'yyyy-MM-dd');

    this.classService.getByInstructor(this.currentInstructorId, startStr, endStr)
      .subscribe({
        next: (data) => {
          this.clases = data.map(c => ({
            ...c,
            
            startTime: c.startTime ? c.startTime.substring(0, 5) : '',
            endTime: c.endTime ? c.endTime.substring(0, 5) : ''
          }));
          this.applyFilters(); 
        },
        error: (err) => console.error('Error al cargar clases', err)
      });
  }


  loadCatalogs() {
    forkJoin({
      rooms: this.classService.getRooms(),
      disciplines: this.workerService.getDisciplines(),
      instructors: this.workerService.getInstructors()
    }).subscribe({
      next: (res) => {
        this.rooms = res.rooms;
        this.disciplines = res.disciplines;
        this.instructors = res.instructors;
      },
      error: (err) => console.error('Error cargando catálogos', err)
    });
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

openClientsModal(clase: ClassSession) {
  this.selectedClass = clase;
  this.classService.getClientsByClass(clase.id!).subscribe({
    next: (data) => {
      this.clients = data;
    
      this.showClientsModal = true;
    },
    error: (err) => {
      
      this.clients = [];
      this.showClientsModal = true; // igual abrimos el modal vacío
    }
  });
}

closeClientsModal() {
  this.showClientsModal = false;
  this.clients = [];
}

}
