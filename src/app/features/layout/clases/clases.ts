import { Component } from '@angular/core';
import { ClassSession, Room } from '../../../core/models/class.model';
import { ClassSessionService } from '../../../core/services/class-session.service';
import { Client, Discipline, Instructor } from '../../../core/models/auth.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkersService } from '../../../core/services/workers.service';
import { AdminService } from '../../../core/services/admin.service';
import { CalendarModule } from 'smart-webcomponents-angular/calendar';import { RadioButtonModule } from 'smart-webcomponents-angular/radiobutton';
import { addDays, format, startOfWeek, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { AttendanceService } from '../../../core/services/attendance.service';

@Component({
  selector: 'app-clases',
  imports: [CommonModule, FormsModule, CalendarModule, RadioButtonModule],
  templateUrl: './clases.html',
  styleUrl: './clases.css'
})
export class Clases   {
  clases: ClassSession[] = [];
  currentDate: Date = new Date();
  weekDays: Date[] = [];
  disciplines: Discipline[] = [];
  instructors: Instructor[] = [];
  rooms: Room[] = [];
  filteredClases: ClassSession[] = []; // La lista que se mostrará en el calendario
  currentClientId!: number; 
  // --- Propiedades para los filtros ---
  searchText: string = '';
  selectedDisciplineId: number | null = null;
  selectedInstructorId: number | null = null;
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

showAttendanceModal = false;
attendanceMap: { [clientId: number]: string } = {};
currentClients: Client[] = [];

messageModal: boolean = false;
messageTitle: string = '';
messageText: string = '';
messageType: string = '';
showComentarioModal: boolean = false;
selectedClass: ClassSession | null = null;
isLoading = false;
showCalendar = false;
selectedDate: string = '';

  constructor(
    private classService: ClassSessionService,
    private workerService: WorkersService,
    private adminService: AdminService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.loadClases();
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

  openComentario(clase: ClassSession) {
  this.selectedClass = clase;
  this.showComentarioModal = true;
}

closeComentarioModal() {
  this.showComentarioModal = false;
}

openAttendance(c: ClassSession) {
  this.currentClass = c;

  this.classService.getClientsByClass(c.id!).subscribe(clients => {
    this.attendanceService.getByClass(c.id!).subscribe(attendances => {
      this.currentClients = clients;
      this.attendanceMap = {};

      clients.forEach(cli => {
        const found = attendances.find(a => a.clientId === cli.id);
        this.attendanceMap[cli.id] = found ? found.status : '';
      });

      this.showAttendanceModal = true;
    });
  });
}



closeAttendanceModal() {
  this.showAttendanceModal = false;
}

saveAttendance() {
  if (!this.currentClass) return;
  const classId = this.currentClass.id!;
  const entries = Object.entries(this.attendanceMap);

  entries.forEach(([clientId, status]) => {
    this.attendanceService.markAttendance(classId, Number(clientId), status).subscribe();
  });

  this.closeAttendanceModal();
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
    const dayClasses = this.filteredClases.filter(clase => {
    
      const claseDate = new Date(clase.startDate + 'T00:00:00'); 
      return claseDate.toDateString() === day.toDateString();
    });

    
    return dayClasses.sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
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
      comentarioAt:'',
    repeatDays: [],    // MONDAY, TUESDAY… (DayOfWeek)
      repeatInterval: 1,

      estado: '',
      clientIds: []
    };
  }

loadClases() {
  this.classService.getAll().subscribe({
    next: (data) => {
      this.clases = data.map(c => ({
        ...c,
        startTime: c.startTime ? c.startTime.substring(0,5) : '',
        endTime: c.endTime ? c.endTime.substring(0,5) : ''
      }));
      this.filteredClases = this.clases;
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

  onDisciplineChange() {
  const discipline = this.disciplines.find(d => d.id === this.form.disciplineId);
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

onToggleRepeatDay(event: any, value: string) {
  if (event.target.checked) {
    this.form.repeatDays.push(value);
  } else {
    this.form.repeatDays = this.form.repeatDays.filter(d => d !== value);
  }
}

  
  openCreate() {
    this.editing = false;
    this.form = this.emptyForm();
    this.openClassModal();
  }
  openEdit(c: ClassSession) {
  if (c.estado === 'DICTADA') return; 
  this.editing = true;
  
  this.form = { 
    ...c, 
    clientIds: c.clientIds ? [...c.clientIds] : [], 
    repeatDays: c.repeatDays ?? null 
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
  this.isLoading = true; // Mostrar el modal de carga

  if (this.editing && payload.id) {
    this.classService.update(payload.id, payload).subscribe({
      next: () => {
        this.isLoading = false; // Ocultar el loader
        this.closeClassModal();
        this.loadClases();
        this.showMessageModal('Clase actualizada', 'La clase fue actualizada correctamente.', 'success');
      },
      error: (err) => {
        this.isLoading = false; // Ocultar el loader incluso si hay error
        const msg = err?.error?.message || 'Error al actualizar la clase.';
        this.showMessageModal('Error al actualizar', msg, 'error');
      }
    });
  } else {
    this.classService.create(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeClassModal();
        this.loadClases();
        this.showMessageModal('Clase creada', 'La clase fue creada correctamente.', 'success');
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err?.error?.message || 'Error al crear la clase.';
        this.showMessageModal('Error al crear', msg, 'error');
      }
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
    
    this.clients = list.filter(cli =>
      cli.disciplines?.some(d => d.id === c.disciplineId)
    );

    this.filteredClients = [...this.clients];
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
  const original = this.currentClass.clientIds ?? [];

  // Clientes nuevos que se deben agregar
  const toAdd = selected.filter(id => !original.includes(id));
  // Clientes que se deben quitar
  const toRemove = original.filter(id => !selected.includes(id));

  // Construimos todas las operaciones (add y remove)
  const ops = [
    ...toAdd.map(id => this.classService.addClientToClass(classId, id)),
    ...toRemove.map(id => this.classService.removeClientFromClass(classId, id))
  ];

  if (ops.length === 0) { 
    this.closeClientsModal(); 
    return; 
  }

  let done = 0;

  ops.forEach(obs => obs.subscribe({
    next: () => { 
      done++; 
      if (done === ops.length) this.finishClients(); 
    },
    error: (err) => {
      

      this.messageTitle = "Error al actualizar clase";
      this.messageText = err.error || "Ocurrió un error al intentar actualizar los clientes de la clase.";
      this.messageType = "error";
      this.messageModal = true;

      done++; 
      if (done === ops.length) this.finishClients(); 
    }
  }));
}

showMessageModal(title: string, text: string, type: 'success' | 'error' = 'success'): void {
  this.messageTitle = title;
  this.messageText = text;
  this.messageType = type;
  this.messageModal = true;
}


closeMessageModal() {
  this.messageModal = false;
}

  

private finishClients() {
  this.closeClientsModal();
  this.loadClases();

  this.messageTitle = "Actualización exitosa";
  this.messageText = "Los clientes fueron actualizados correctamente.";
  this.messageType = "success";
  this.messageModal = true;
}


 
}