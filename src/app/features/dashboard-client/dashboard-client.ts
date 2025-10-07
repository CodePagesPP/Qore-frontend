import { Component, OnInit } from '@angular/core';
import { PlanResponse } from '../../core/models/plan.model';
import { ModalPlanes } from '../layout/modal-planes/modal-planes';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/auth.model';
import { ClientClassDTO, ClientPlanInfo } from '../../core/models/class.model';
import { ClientService } from '../../core/services/client.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-client',
  imports: [ModalPlanes, CommonModule, NgxPaginationModule, RouterLink],
  templateUrl: './dashboard-client.html',
  styleUrl: './dashboard-client.css'
})
export class DashboardClient implements  OnInit{
  showPlansModal = false;
  currentClientId?: number;
  clientPlanInfo?: ClientPlanInfo;
  p: number = 1; 
  myClasses: ClientClassDTO []=[];
  constructor(private authService: AuthService, private clientService: ClientService) {}


  ngOnInit(): void {
    this.getclasses();
    // al cargar el componente pedimos el perfil
    this.authService.getUserInfo().subscribe({
      next: (profile: User) => {
        this.currentClientId = profile.id;
        this.clientService.getClientPlanInfo(profile.id).subscribe(planInfo => {
        this.clientPlanInfo = planInfo;
      });
      },
      error: (err) => console.error('Error al obtener perfil', err),
    });
  }

  getclasses(){
    this.clientService.getMyClasses().subscribe(classes => {
    this.myClasses = classes;
  });
  }

openModal() {
  this.showPlansModal = true;
}

closeModal() {
  this.showPlansModal = false;
}

}
