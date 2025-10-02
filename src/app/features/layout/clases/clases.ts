import { Component } from '@angular/core';
import { ClassSession, Room } from '../../../core/models/class.model';
import { ClassSessionService } from '../../../core/services/class-session.service';
import { Client, Discipline, Instructor } from '../../../core/models/auth.model';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkersService } from '../../../core/services/workers.service';
import { AdminService } from '../../../core/services/admin.service';
import { ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { CalendarComponent } from 'smart-webcomponents-angular/calendar';
import { RadioButtonComponent } from 'smart-webcomponents-angular/radiobutton';
import { RouterOutlet } from '@angular/router';
import { CalendarModule } from 'smart-webcomponents-angular/calendar';import { RadioButtonModule } from 'smart-webcomponents-angular/radiobutton';

@Component({
  selector: 'app-clases',
  imports: [CommonModule, FormsModule, CalendarModule, RadioButtonModule],
  templateUrl: './clases.html',
  styleUrl: './clases.css'
})
export class Clases implements AfterViewInit  {
  clases: ClassSession[] = [];

  disciplines: Discipline[] = [];
  instructors: Instructor[] = [];
  rooms: Room[] = [];


  showClassModal = false;
  editing: boolean = false;
  form: ClassSession = this.emptyForm();


  showClientsModal = false;
  currentClass: ClassSession | null = null;
  clients: Client[] = [];
  filteredClients: Client[] = [];
  selectedClientIds = new Set<number>();
  clientSearch = '';
  estados: string[] = ['PENDIENTE', 'DICTADA', 'CANCELADA'];
  daysOfWeek = [
  { value: 'MONDAY', label: 'Lunes' },
  { value: 'TUESDAY', label: 'Martes' },
  { value: 'WEDNESDAY', label: 'Miércoles' },
  { value: 'THURSDAY', label: 'Jueves' },
  { value: 'FRIDAY', label: 'Viernes' },
  { value: 'SATURDAY', label: 'Sábado' },
  { value: 'SUNDAY', label: 'Domingo' },
];



  constructor(
    private classService: ClassSessionService,
    private workerService: WorkersService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadClases();
    this.loadCatalogs();

  }

  private emptyForm(): ClassSession {
    return {
      name: '',
      disciplineId: 0,
      instructorId: 0,
      roomId: 0,
      capacity: 0,
      startDate: '',
      startTime: '',
      endTime: '',
      repeat: false,
      repeatUntil: null,      // YYYY-MM-DD
  repeatDay: null,    // MONDAY, TUESDAY… (DayOfWeek)
  repeatInterval: 0,
      estado: '',
      clientIds: []
    };
  }

  loadClases() {
  this.classService.getAll().subscribe(data => {
    this.clases = data;
    this.filteredByDate = [...this.clases]; // inicializar aquí cuando ya hay datos
  });
}


  onDisciplineChange() {
  const discipline = this.disciplines.find(d => d.id === this.form.disciplineId);
  if (discipline) {
    this.form.startTime = discipline.startTime;
    this.form.endTime = discipline.endTime;
  }
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


  
  openCreate() {
    this.editing = false;
    this.form = this.emptyForm();
    this.openClassModal();
  }
  openEdit(c: ClassSession) {
  this.editing = true;
  
  this.form = { 
    ...c, 
    clientIds: c.clientIds ? [...c.clientIds] : [], 
    repeatDay: c.repeatDay ?? null 
  };
  this.openClassModal();
}
  openClassModal() {
    this.showClassModal = true;
    document.body.style.overflow = 'hidden'; 
  }
  closeClassModal() {
    this.showClassModal = false;
    document.body.style.overflow = ''; 
  }
  saveClass() {
    const payload: ClassSession = { ...this.form };
    if (this.editing && payload.id) {
      this.classService.update(payload.id, payload).subscribe(() => {
        this.closeClassModal();
        this.loadClases();
      });
    } else {
      this.classService.create(payload).subscribe(() => {
        this.closeClassModal();
        this.loadClases();
      });
    }
  }

  deleteClase(id?: number) {
    if (!id) return;
    if (confirm('¿Seguro que deseas eliminar esta clase?')) {
      this.classService.delete(id).subscribe(() => this.loadClases());
    }
  }

  
  openClients(c: ClassSession) {
    this.currentClass = c;
    this.selectedClientIds = new Set(c.clientIds ?? []);
    this.clientSearch = '';
    
    this.adminService.getAllActiveClients().subscribe(list => {
      this.clients = list;
      this.filteredClients = list;
      this.openClientsModal();
    });
  }
  openClientsModal() {
    this.showClientsModal = true;
    document.body.style.overflow = 'hidden';
  }
  closeClientsModal() {
    this.showClientsModal = false;
    document.body.style.overflow = '';
  }
  filterClients() {
    const q = this.clientSearch.toLowerCase().trim();
    this.filteredClients = !q
      ? this.clients
      : this.clients.filter(c =>
          c.name.toLowerCase().includes(q) ||
          (c.email ?? '').toLowerCase().includes(q)
        );
  }
  toggleClient(id: number) {
    if (!this.currentClass) return;
    if (this.selectedClientIds.has(id)) {
      this.selectedClientIds.delete(id);
    } else {
      
      const cap = this.currentClass.capacity ?? 0;
      if (this.selectedClientIds.size >= cap) return;
      this.selectedClientIds.add(id);
    }
  }
  saveClients() {
    if (!this.currentClass) return;
    const classId = this.currentClass.id!;
    const selected = Array.from(this.selectedClientIds);

    
    const ops = selected
      .filter(id => !(this.currentClass!.clientIds ?? []).includes(id))
      .map(id => this.classService.addClientToClass(classId, id));

    if (ops.length === 0) { this.closeClientsModal(); return; }

    let done = 0;
    ops.forEach(obs => obs.subscribe({
      next: () => { done++; if (done === ops.length) this.finishClients(); },
      error: () => { done++; if (done === ops.length) this.finishClients(); }
    }));
  }
  private finishClients() {
    this.closeClientsModal();
    this.loadClases();
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

calendarView: 'day' | 'week' | 'month' = 'month';

setView(view: 'day' | 'week' | 'month') {
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

// Helper: convierte "YYYY-MM-DD" o "YYYY-MM-DDTHH:MM:..." o Date a Date local con horas 00:00
private parseDateOnly(value: string | Date): Date {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  if (typeof value === 'string') {
    // tomar solo la parte fecha antes de la 'T' si existe
    const isoDate = value.split('T')[0]; // "YYYY-MM-DD"
    const parts = isoDate.split('-').map(p => Number(p));
    if (parts.length === 3 && parts.every(n => !isNaN(n))) {
      return new Date(parts[0], parts[1] - 1, parts[2]); // local midnight
    }
    // fallback
    const d = new Date(value);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  return new Date();
}

filterClases() {
  if (!this.selectedDate) {
    this.filteredByDate = [...this.clases];
    return;
  }

  const dateObj = this.parseDateOnly(this.selectedDate);

  if (this.calendarView === 'day') {
    const selectedDay = dateObj;

    this.filteredByDate = this.clases.filter(c => {
      const classDate = this.parseDateOnly(c.startDate);
      const same =
        classDate.getFullYear() === selectedDay.getFullYear() &&
        classDate.getMonth() === selectedDay.getMonth() &&
        classDate.getDate() === selectedDay.getDate();

      return same;
    });

  } else if (this.calendarView === 'week') {
   
    const day = dateObj.getDay(); 
    const diffToMonday = (day === 0 ? -6 : 1 - day);
    const firstDay = new Date(dateObj);
    firstDay.setDate(dateObj.getDate() + diffToMonday);
    firstDay.setHours(0, 0, 0, 0);

    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);
    lastDay.setHours(23, 59, 59, 999);

    this.filteredByDate = this.clases.filter(c => {
      const classDate = this.parseDateOnly(c.startDate);
      const inside = classDate >= firstDay && classDate <= lastDay;

      return inside;
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