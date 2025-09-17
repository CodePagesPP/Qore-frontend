import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/auth.model';

@Component({
  selector: 'app-dashboard-instructor',
  imports: [],
  templateUrl: './dashboard-instructor.html',
  styleUrl: './dashboard-instructor.css'
})
export class DashboardInstructor {
  currentInstructorId?: number;
  constructor(private authService: AuthService) {}


  ngOnInit(): void {
    // al cargar el componente pedimos el perfil
    this.authService.getUserInfo().subscribe({
      next: (profile: User) => {
        this.currentInstructorId = profile.id;
      },
      error: (err) => console.error('Error al obtener perfil', err),
    });
  }
}
