import { Component, OnInit} from '@angular/core';
import { PaymentService } from '../../core/services/payment.service';
import { CommonModule } from '@angular/common';
import { ExcelService } from '../../core/services/excel.service';
import { ClassSessionService } from '../../core/services/class-session.service';


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
  weeklyClassesCount: number = 0;
  
  

  constructor(private paymentsService: PaymentService, private excelService: ExcelService, private classSessionService: ClassSessionService) {}

ngOnInit(): void {
    this.paymentMensual();
    this.classMonth();
  }

  paymentMensual(){
    this.paymentsService.getCurrentMonthIncome().subscribe(data => {
      this.currentMonthIncome = data.total;
      this.goal = data.goal;
      this.percentage = data.percentage; 
    });
  }

  classMonth(){
    this.classSessionService.getWeeklyClassCount().subscribe(res => {
      this.weeklyClassesCount = res.weeklyCount; 
    });
  }


 onDownloadExcel() {
  this.excelService.downloadMonthlyIncome().subscribe((blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'REPORTE_MENSUAL.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  });
}

}
