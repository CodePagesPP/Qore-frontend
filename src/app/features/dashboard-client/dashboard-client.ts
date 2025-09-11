import { Component, OnInit } from '@angular/core';
import { PlanResponse } from '../../core/models/plan.model';
import { ModalPlanes } from '../layout/modal-planes/modal-planes';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/auth.model';

@Component({
  selector: 'app-dashboard-client',
  imports: [ModalPlanes],
  templateUrl: './dashboard-client.html',
  styleUrl: './dashboard-client.css'
})
export class DashboardClient implements  OnInit{
  showPlansModal = false;
  currentClientId?: number;
  constructor(private authService: AuthService) {}


  ngOnInit(): void {
    // al cargar el componente pedimos el perfil
    this.authService.getUserInfo().subscribe({
      next: (profile: User) => {
        this.currentClientId = profile.id;
      },
      error: (err) => console.error('Error al obtener perfil', err),
    });
  }


openModal() {
  this.showPlansModal = true;
}

closeModal() {
  this.showPlansModal = false;
}


}
