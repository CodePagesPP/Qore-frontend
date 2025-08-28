import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Permission, Role, RoleDTO, RoleE } from '../models/auth.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private roleAPIurl = `${environment.apiUrl}/rol`;
  private permissionAPIurl = `${environment.apiUrl}/permission`;
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getRoles(): Observable<RoleE[]> {
    return this.http.get<RoleE[]>(`${this.roleAPIurl}/list`,{ headers: this.getAuthHeaders() });
  }

  createRole(dto: RoleDTO): Observable<RoleE> {
    return this.http.post<RoleE>(`${this.roleAPIurl}/create`, dto,{ headers: this.getAuthHeaders() });
  }

  updateRole(id: number, dto: RoleDTO): Observable<RoleE> {
    return this.http.put<RoleE>(`${this.roleAPIurl}/update/${id}`, dto,{ headers: this.getAuthHeaders() });
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.roleAPIurl}/delete/${id}`,{ headers: this.getAuthHeaders() });
  }

  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.permissionAPIurl}/list`,{ headers: this.getAuthHeaders() });
  }

  getRolesNoClient(): Observable<Role[]> {
      return this.http
        .get<Role[]>(`${this.roleAPIurl}/listRoleNoClient`, { headers: this.getAuthHeaders() })
        .pipe(
          map((roles: Role[]) => {
            return roles.map((role) => {
              return role;
            });
          })
        );
    }
}
