import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlanResponse } from '../../../core/models/plan.model';
import { PlanService } from '../../../core/services/plan.service';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../core/services/payment.service';

@Component({
  selector: 'app-modal-planes',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './modal-planes.html',
  styleUrl: './modal-planes.css'
})
export class ModalPlanes {
  @Input() showModal = false;
  @Output() close = new EventEmitter<void>();
  @Input() clientId?: number;

  plans: PlanResponse[] = [];

  constructor(private planService: PlanService,private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans() {
    this.planService.getAllPlans().subscribe({
      next: (data) => this.plans = data.filter(p => p.active),
      error: (err) => console.error('Error loading plans', err)
    });
  }

  onSelect(plan: PlanResponse) {
  if (!this.clientId) {
    console.error('No se encontró clientId');
    return;
  }
  this.paymentService.startCheckout(this.clientId, plan.id).subscribe({
    next: (res) => {
      window.location.href = res.init_point; 
    },
    error: (err) => console.error('Error starting checkout', err),
  });
}

  onClose() {
    this.close.emit();
  }
}
