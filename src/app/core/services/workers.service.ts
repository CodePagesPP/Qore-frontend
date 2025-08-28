import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  Discipline,
  Instructor,
  Role,
  workerRegisterRequest,
  workerUpdateRequest,
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class WorkersService {
  private adminUrl = `${environment.apiUrl}/admin`;
  private staffAPIurl = `${environment.apiUrl}/staff`;
  private instructorAPIurl = `${environment.apiUrl}/instructor`;
  private managerAPIurl = `${environment.apiUrl}/manager`;
  private roleAPIurl = `${environment.apiUrl}/rol`;
  private disciplineAPIurl = `${environment.apiUrl}/disciplines`;
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  getPersonal(): Observable<{ [key: string]: any[] }> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{ [key: string]: any[] }>(
      `${environment.apiUrl}/admin/listPersonal`,
      { headers }
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getInstructors(): Observable<Instructor[]> {
      return this.http.get<Instructor[]>(`${this.instructorAPIurl}/listInstructor`,{ headers: this.getAuthHeaders() });
    }

  registerStaff(dto: workerRegisterRequest): Observable<workerRegisterRequest> {
    return this.http.post<workerRegisterRequest>(
      `${this.adminUrl}/registerStaff`,dto,{ headers: this.getAuthHeaders() }
    );
  }

  registerManager(
    dto: workerRegisterRequest
  ): Observable<workerRegisterRequest> {
    return this.http.post<workerRegisterRequest>(
      `${this.adminUrl}/registerManager`,
      dto,
      { headers: this.getAuthHeaders() }
    );
  }

  registerInstructor(
    dto: workerRegisterRequest
  ): Observable<workerRegisterRequest> {
    return this.http.post<workerRegisterRequest>(
      `${this.adminUrl}/registerInstructor`,
      dto,
      { headers: this.getAuthHeaders() }
    );
  }

  registerWorker(
    dto: workerRegisterRequest
  ): Observable<workerRegisterRequest> {
    return this.http.post<workerRegisterRequest>(
      `${this.adminUrl}/registerWorker`,
      dto,
      { headers: this.getAuthHeaders() }
    );
  }

  updateWorker(dni:string, dto: workerUpdateRequest) :Observable<workerUpdateRequest> {
    return this.http.put<workerUpdateRequest>(
      `${this.adminUrl}/updateWorker/${dni}`,
      dto,
      { headers: this.getAuthHeaders() }
    )
  }

  updateStaff(
    dni: string,
    dto: workerUpdateRequest
  ) :Observable<workerUpdateRequest> {
    return this.http.put<workerUpdateRequest>(
      `${this.staffAPIurl}/updateStaff/${dni}`,
      dto,
      { headers: this.getAuthHeaders() }
    )
  }

  updateInstructor(
    dni: string,
    dto: workerUpdateRequest
  ) :Observable<workerUpdateRequest> {
    return this.http.put<workerUpdateRequest>(
      `${this.instructorAPIurl}/updateInstructor/${dni}`,
      dto,
      { headers: this.getAuthHeaders() }
    )
  }

  updateManager(
    dni: string,
    dto: workerUpdateRequest
  ) :Observable<workerUpdateRequest> {
    return this.http.put<workerUpdateRequest>(
      `${this.managerAPIurl}/updateManager/${dni}`,
      dto,
      { headers: this.getAuthHeaders() }
    )
  }

  

  getDisciplines(): Observable<Discipline[]> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get<Discipline[]>(`${this.disciplineAPIurl}`, { headers })
      .pipe(
        map((disciplines: Discipline[]) => {
          return disciplines.map((discipline) => {
            return discipline;
          });
        })
      );
  }
}
