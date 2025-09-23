import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-recuperar-pass',
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperar-pass.html',
  styleUrl: './recuperar-pass.css'
})
export class RecuperarPass {
  @Input() showModalRecovery = false;
  error: string | null = null;
  @Output() close = new EventEmitter<void>();

  email = '';

  onClose() {
    this.close.emit();
  }
}
