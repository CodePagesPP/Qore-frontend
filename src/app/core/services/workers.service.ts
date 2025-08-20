import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Discipline, Instructor, Manager, Staff } from '../models/auth.model';


@Injectable({
  providedIn: 'root'
})
export class WorkersService {
  private staffAPIurl = `${environment.apiUrl}/staff`;
  private managerAPIurl = `${environment.apiUrl}/manager`;
  private instructorAPIurl = `${environment.apiUrl}/instructor`;
  private disciplineAPIurl = `${environment.apiUrl}/disciplines`;
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  getStaff (): Observable<Staff[]> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Staff[]>(`${this.staffAPIurl}/listStaff`, {headers}).pipe(
      map((staffs:Staff[]) => {
        return staffs.map(staff => {
          return staff;
        });
      })
    );
  }

  getManager (): Observable<Manager[]> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Manager[]>(`${this.managerAPIurl}/listManager`, {headers}).pipe(
      map((managers:Manager[]) => {
        return managers.map(manager => {
          return manager;
        });
      })
    );
  }

  getInstructor (): Observable<Instructor[]> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Instructor[]>(`${this.instructorAPIurl}/listInstructor`, {headers}).pipe(
      map((instructors:Instructor[]) => {
        return instructors.map(instructor => {
          return instructor;
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
