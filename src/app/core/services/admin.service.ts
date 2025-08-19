import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Client } from '../models/auth.model';
import { map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private adminUrl = `${environment.apiUrl}/admin`;

  private tokenKey = 'token'

  constructor(private http: HttpClient, private router: Router) {}

   getAllActiveClients(): Observable<Client[]> {
    const token = localStorage.getItem(this.tokenKey); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Client[]>(`${this.adminUrl}/clients`, { headers }).pipe(
      map ((clients : Client[])=>{
        return clients.map(client => {
          return client;

        });
      })
    );
  }
}
