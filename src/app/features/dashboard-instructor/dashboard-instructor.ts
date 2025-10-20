import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Discipline, User } from '../../core/models/auth.model';
import { InstructorService } from '../../core/services/instructor.service';
import { ClassSession, InstructorStats, Room } from '../../core/models/class.model';
import { ClassSessionService } from '../../core/services/class-session.service';
import { CommonModule } from '@angular/common';
import { WorkersService } from '../../core/services/workers.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-instructor',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-instructor.html',
  styleUrl: './dashboard-instructor.css'
})
export class DashboardInstructor {
  currentInstructorId?: number;
  stats?: InstructorStats;

    disciplines: Discipline[] = [];
    rooms: Room[] = [];

  pendingClassesToday: ClassSession[] = [];


  constructor(private authService: AuthService, private instructorService: InstructorService, private classSessionService: ClassSessionService
    , private workerService: WorkersService
  ) {}


ngOnInit(): void {
  this.authService.getUserInfo().subscribe({
    next: (profile: User) => {
      this.currentInstructorId = profile.id;

      // catálogos primero:
      this.classSessionService.getRooms().subscribe(rs => this.rooms = rs);
      this.workerService.getDisciplines().subscribe(ds => this.disciplines = ds);
      // estadísticas e info:
      this.loadPendingToday(this.currentInstructorId);
      this.instructorService.getInstructorStats(profile.id)
        .subscribe(planInfo => this.stats = planInfo);
    },
    error: (err) => console.error('Error al obtener perfil', err),
  });
}


 getDisciplineName(id: number): string {
  const discipline = this.disciplines?.find(d => d.id === id);
  return discipline ? discipline.name : id.toString();
}
getRoomName(id: number): string {
  const room = this.rooms?.find(r => r.id === id);
  return room ? room.name : id.toString();
}


loadPendingToday(instructorid: number): void {
  this.classSessionService.getPendingTodayInstructor(instructorid)
    .subscribe({
      next: (data) => {
        

       
        this.pendingClassesToday = data.map(c => ({
          ...c,
          startTime: c.startTime ? c.startTime.substring(0, 5) : '',
          endTime: c.endTime ? c.endTime.substring(0, 5) : ''
        }));
      },
      error: (err) => console.error('Error al cargar clases pendientes del día', err)
    });
}


}
