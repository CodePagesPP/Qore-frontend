import { Component, OnInit } from '@angular/core';
import { Room } from '../../../core/models/class.model';
import { RoomService } from '../../../core/services/room.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rooms',
  imports: [FormsModule, CommonModule],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css'
})
export class Rooms implements OnInit {
  rooms: Room[] = [];
  currentRoom: Room = { name: '' };
  isEditing = false;

 
  isModalOpen = false;

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms() {
    this.roomService.getAll().subscribe(data => this.rooms = data);
  }

  openModal(room?: Room) {
    if (room) {
      this.currentRoom = { ...room };
      this.isEditing = true;
    } else {
      this.currentRoom = { name: '' };
      this.isEditing = false;
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.currentRoom = { name: '' };
    this.isEditing = false;
  }

  saveRoom() {
    if (this.isEditing && this.currentRoom.id) {
      this.roomService.update(this.currentRoom.id, this.currentRoom).subscribe(() => {
        this.loadRooms();
        this.closeModal();
      });
    } else {
      this.roomService.create(this.currentRoom).subscribe(() => {
        this.loadRooms();
        this.closeModal();
      });
    }
  }

 


  deleteRoom(id: number) {
  if (confirm('¿Seguro que deseas eliminar esta disciplina?')) {
    this.roomService.delete(id).subscribe({
      next: () => this.loadRooms(),
      error: (err) => {
        if (err.error?.message) {
          alert(err.error.message); 
        } else {
          alert('Ocurrió un error inesperado al eliminar la disciplina.');
        }
      }
    });
  }
}
}
