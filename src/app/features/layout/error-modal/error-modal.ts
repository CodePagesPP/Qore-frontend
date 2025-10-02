import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../../../core/services/error-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-modal',
  imports: [CommonModule],
  templateUrl: './error-modal.html',
  styleUrl: './error-modal.css'
})
export class ErrorModal implements OnInit{
message: string | null = null;

  constructor(private errorService: ErrorService) {}

  ngOnInit(): void {
    this.errorService.error$.subscribe(msg => this.message = msg);
  }

  close() {
    this.errorService.clear();
  }
}
