import { Component, OnInit} from '@angular/core';
import { PaymentService } from '../../core/services/payment.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard.component',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
currentMonthIncome: number = 0;
goal: number = 0;
  percentage: number = 0;
  
  

  constructor(private paymentsService: PaymentService) {}

ngOnInit(): void {
    this.paymentsService.getCurrentMonthIncome().subscribe(data => {
      this.currentMonthIncome = data.total;
      this.goal = data.goal;
      this.percentage = data.percentage; // porcentaje calculado
    });
  }
}
