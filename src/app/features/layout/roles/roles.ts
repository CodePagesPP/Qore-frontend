import { Component, OnInit } from '@angular/core';
import { Permission, RoleDTO, RoleE } from '../../../core/models/auth.model';
import { RolService } from '../../../core/services/rol.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles',
  imports: [FormsModule, CommonModule],
  templateUrl: './roles.html',
  styleUrl: './roles.css'
})
export class Roles implements OnInit{
  roles: RoleE[] = [];
  permissions: Permission[] = [];

 
  isModalOpen = false;
  isEdit = false;
  currentRole: RoleDTO = { name: '', description: '', permissionIds: [] };

  constructor(private roleService: RolService) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles() {
    this.roleService.getRoles().subscribe(rs => this.roles = rs);
  }

  loadPermissions() {
    this.roleService.getPermissions().subscribe(ps => this.permissions = ps);
  }

  openModal(role?: RoleE) {
    this.isModalOpen = true;
    this.isEdit = !!role;
    if (role) {
      this.currentRole = {
        id: role.id,
        name: role.name,
        description: role.description,
        permissionIds: role.permissions.map(p => p.id)
      };
    } else {
      this.currentRole = { name: '', description: '', permissionIds: [] };
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  togglePermission(id: number) {
    if (this.currentRole.permissionIds.includes(id)) {
      this.currentRole.permissionIds = this.currentRole.permissionIds.filter(pid => pid !== id);
    } else {
      this.currentRole.permissionIds.push(id);
    }
  }

  saveRole() {
    if (this.isEdit && this.currentRole.id) {
      this.roleService.updateRole(this.currentRole.id, this.currentRole).subscribe(() => {
        this.loadRoles();
        this.closeModal();
      });
    } else {
      this.roleService.createRole(this.currentRole).subscribe(() => {
        this.loadRoles();
        this.closeModal();
      });
    }
  }

  deleteRole(id: number) {
    if (confirm('¿Seguro de eliminar este rol?')) {
      this.roleService.deleteRole(id).subscribe(() => this.loadRoles());
    }
  }
}
