import { Component, ViewChild } from '@angular/core';
import { ClassSession, Room } from '../../../core/models/class.model';
import { Discipline, Instructor } from '../../../core/models/auth.model';
import { ClassSessionService } from '../../../core/services/class-session.service';
import { WorkersService } from '../../../core/services/workers.service';
import { AuthService } from '../../../core/services/auth.service';
import {CalendarModule } from 'smart-webcomponents-angular/calendar';
import { RadioButtonModule } from 'smart-webcomponents-angular/radiobutton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addDays, format, startOfWeek, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-clases-client',
  imports: [CommonModule, FormsModule, CalendarModule, RadioButtonModule],
  templateUrl: './clases-client.html',
  styleUrl: './clases-client.css',
})
export class ClasesClient {
  currentDate: Date = new Date();
  weekDays: Date[] = [];
  clases: ClassSession[] = [];
  disciplines: Discipline[] = [];
  instructors: Instructor[] = [];
  rooms: Room[] = [];
  filteredClases: ClassSession[] = []; // La lista que se mostrará en el calendario
  // --- Propiedades para los filtros ---
  searchText: string = '';
  selectedDisciplineId: number | null = null;
  selectedInstructorId: number | null = null;
  currentClientId!: number;
  selectedClass?: ClassSession;
  comentario: string = '';
  showModal = false;

  confirmJoinModal = false;
  successModal = false;
  messageModal = false;
messageTitle = '';
messageText = '';
messageType: 'success' | 'error' = 'success';
loading: boolean = false;
showCalendar = false;
selectedDate: string = '';

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

  openMessageModal(title: string, text: string, type: 'success' | 'error' = 'success') {
  this.messageTitle = title;
  this.messageText = text;
  this.messageType = type;
  this.messageModal = true;
}

closeMessageModal() {
  this.messageModal = false;
}


  generateWeek() {
    // Obtenemos el Lunes de la semana de 'currentDate'
    // { weekStartsOn: 1 } le dice que la semana empieza el Lunes
    const monday = startOfWeek(this.currentDate, { weekStartsOn: 1 });

    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      // Añadimos cada día de la semana a partir del Lunes
      this.weekDays.push(addDays(monday, i));
    }
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

  // Función extra para formatear el título de la semana en español
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

  // Coloca esta función dentro de la clase ClasesClient
  getClassesForDay(day: Date): ClassSession[] {
    // Filtra el array principal de clases
    return this.clases.filter((clase) => {
      // Compara si la fecha de la clase (sin la hora) es igual a la del día que se está renderizando
      const parts = clase.startDate.split('-');
      const claseDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return claseDate.toDateString() === day.toDateString();
    });
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

confirmJoin() {
  if (!this.selectedClass || this.selectedClass.id === undefined) {
    this.openMessageModal('Error', 'Clase inválida', 'error');
    return;
  }

  const clientId = this.currentClientId;

  if (this.selectedClass.clientIds?.includes(clientId)) {
    this.openMessageModal('Aviso', 'Ya estás inscrito en esta clase.', 'error');
    this.confirmJoinModal = false;
    return;
  }

  if ((this.selectedClass.clientIds?.length || 0) >= this.selectedClass.capacity) {
    this.openMessageModal('Error', 'La clase ya alcanzó su capacidad máxima', 'error');
    this.confirmJoinModal = false;
    return;
  }

  this.confirmJoinModal = false;
  this.loading = true; // 🔹 mostrar modal de carga

  this.classService.joinClass(this.selectedClass.id!, clientId).subscribe({
    next: (res: any) => {
      this.selectedClass!.joined = true;
      this.selectedClass!.clientIds = [...(this.selectedClass!.clientIds || []), clientId];

      this.loading = false; // 🔹 ocultar modal de carga
      this.openMessageModal('Éxito', 'Te has inscrito correctamente en la clase.', 'success');
    },
    error: (err) => {
      this.loading = false; // 🔹 ocultar modal de carga
      const msg = err.error?.message || 'Error al unirse a la clase';
      this.openMessageModal('Error', msg, 'error');
    },
  });
}



  closeSuccessModal() {
    this.successModal = false;
  }

loadClases() {
  this.classService.getClientByDiscipline(this.currentClientId).subscribe({
    next: (data) => {
      this.clases = data.map(clase => ({
        ...clase,
        joined: clase.clientIds?.includes(this.currentClientId),
        startTime: clase.startTime ? clase.startTime.substring(0,5) : '',
        endTime: clase.endTime ? clase.endTime.substring(0,5) : ''
      }));
      this.filteredClases = [...this.clases];
    },
    error: (err) => console.error('Error al cargar clases', err)
  });
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

  clearFilters() {
    // Reseteamos los valores de los filtros
    this.searchText = '';
    this.selectedDisciplineId = null;
    this.selectedInstructorId = null;
    
    // Aplicamos los filtros para que se muestren todas las clases de nuevo
    this.applyFilters();
  }

  loadCatalogs() {
    this.classService.getRooms().subscribe((rs) => (this.rooms = rs));
    this.workerService
      .getDisciplines()
      .subscribe((ds) => (this.disciplines = ds));
    this.workerService
      .getInstructors()
      .subscribe((is) => (this.instructors = is));
  }

  getDisciplineName(id: number): string {
    const discipline = this.disciplines?.find((d) => d.id === id);
    return discipline ? discipline.name : id.toString();
  }

  getInstructorName(id: number): string {
    const instructor = this.instructors?.find((i) => i.id === id);
    return instructor ? instructor.name : id.toString();
  }

  getRoomName(id: number): string {
    const room = this.rooms?.find((r) => r.id === id);
    return room ? room.name : id.toString();
  }

}
