import { Component } from '@angular/core';
import { ClassSession, Room } from '../../../core/models/class.model';
import { ClassSessionService } from '../../../core/services/class-session.service';
import { Client, Discipline, Instructor } from '../../../core/models/auth.model';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkersService } from '../../../core/services/workers.service';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-clases',
  imports: [CommonModule, FormsModule],
  templateUrl: './clases.html',
  styleUrl: './clases.css'
})
export class Clases {
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
      clientIds: []
    };
  }

  loadClases() {
    this.classService.getAll().subscribe(data => this.clases = data);
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
    this.form = { ...c, clientIds: c.clientIds ? [...c.clientIds] : [] };
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
}
