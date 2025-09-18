import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/auth.model';
import { InstructorService } from '../../core/services/instructor.service';
import { InstructorStats } from '../../core/models/class.model';

@Component({
  selector: 'app-dashboard-instructor',
  imports: [],
  templateUrl: './dashboard-instructor.html',
  styleUrl: './dashboard-instructor.css'
})
export class DashboardInstructor {
  currentInstructorId?: number;
  stats?: InstructorStats;
  constructor(private authService: AuthService, private instructorService: InstructorService) {}


  ngOnInit(): void {
    // al cargar el componente pedimos el perfil
    this.authService.getUserInfo().subscribe({
      next: (profile: User) => {
        this.currentInstructorId = profile.id;
         this.instructorService.getInstructorStats(profile.id).subscribe(planInfo => {
        this.stats = planInfo;
      });
      },
      error: (err) => console.error('Error al obtener perfil', err),
    });
  }


}
