import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Client } from '../../../core/models/auth.model';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-crud-clients',
  imports: [RouterLink, CommonModule],
  templateUrl: './crud-clients.html',
  styleUrl: './crud-clients.css'
})
export class CrudClients implements OnInit{
  clients : Client[] = [];

  constructor(
   private clientService: AdminService
 ) {}
 
 ngOnInit() {
   this.loadClients();
 }
 
 
  loadClients() {
   this.clientService.getAllActiveClients().subscribe(
     data => {
       this.clients = data;
       
    
       this.clients.forEach(client => {
         if (client.id !== undefined) {
         } else {
           console.error('El ID del cliente es undefined:', client);
         }
       });
     },
     error => console.error(error)
   );
 }
}
