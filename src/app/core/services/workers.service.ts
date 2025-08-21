import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Discipline, Instructor, Manager, Role, Staff, workerRegisterRequest } from '../models/auth.model';


@Injectable({
  providedIn: 'root'
})
export class WorkersService {
  private adminUrl = `${environment.apiUrl}/admin`;
  private roleAPIurl = `${environment.apiUrl}/rol`;
  private disciplineAPIurl = `${environment.apiUrl}/disciplines`;
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  getPersonal(): Observable<{ [key: string]: any[] }> {
  const token = localStorage.getItem(this.tokenKey);
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<{ [key: string]: any[] }>(`${environment.apiUrl}/admin/listPersonal`, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem(this.tokenKey);
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    registerStaff(dto: workerRegisterRequest): Observable<workerRegisterRequest> {
      return this.http.post<workerRegisterRequest>(`${this.adminUrl}/registerStaff`, dto, { headers: this.getAuthHeaders() });
    }

    registerManager(dto: workerRegisterRequest): Observable<workerRegisterRequest> {
      return this.http.post<workerRegisterRequest>(`${this.adminUrl}/registerManager`, dto, { headers: this.getAuthHeaders() });
    }

    registerInstructor(dto: workerRegisterRequest): Observable<workerRegisterRequest> {
      return this.http.post<workerRegisterRequest>(`${this.adminUrl}/registerInstructor`, dto, { headers: this.getAuthHeaders() });
    }

    registerWorker(dto: workerRegisterRequest): Observable<workerRegisterRequest> {
      return this.http.post<workerRegisterRequest>(`${this.adminUrl}/registerWorker`, dto, { headers: this.getAuthHeaders() });
    }

  getRolesNoClient (): Observable<Role[]> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Role[]>(`${this.roleAPIurl}/listRoleNoClient`, {headers}).pipe(
      map((roles:Role[]) => {
        return roles.map(role => {
          return role;
        });
      })
    );
  }

  getDisciplines (): Observable<Discipline[]> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Discipline[]>(`${this.disciplineAPIurl}`, {headers}).pipe(
      map((disciplines:Discipline[]) => {
        return disciplines.map(discipline => {
          return discipline;
        });
      })
    );
  }


}
