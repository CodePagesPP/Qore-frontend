import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-recuperar-pass',
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperar-pass.html',
  styleUrl: './recuperar-pass.css'
})
export class RecuperarPass {
  isModalOpen = false;

    closeModal() {
    this.isModalOpen = false;
  }
}
