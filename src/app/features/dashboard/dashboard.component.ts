import { Component, OnInit} from '@angular/core';
import { PaymentService } from '../../core/services/payment.service';
import { CommonModule } from '@angular/common';
import { ExcelService } from '../../core/services/excel.service';
import { ClassSessionService } from '../../core/services/class-session.service';
import { ClientService } from '../../core/services/client.service';
import { Client, ClientRegisterNewDTO, ClientSubscriptionEndedDTO } from '../../core/models/auth.model';
import { ClientEndingSoon } from '../../core/models/class.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { WorkersService } from '../../core/services/workers.service';


@Component({
  selector: 'app-dashboard.component',
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  currentMonthIncome: number = 0;
  goal: number = 0;
  percentage: number = 0;
  weeklyClassesCount: number = 0;
  clients: Client[] = [];
  clientsEnding: ClientEndingSoon[] = [];
  newClients: ClientRegisterNewDTO[] =[];
  p: number = 1; 
  pE: number = 1; 
  currentMonthClients: number = 0;
  workers = 0;
  inactiveClientsCount = 0;
  inactiveClients: ClientSubscriptionEndedDTO[] = [];
  showInactiveModal = false;

  constructor(private clientService: ClientService,private workersService: WorkersService,private paymentsService: PaymentService, private excelService: ExcelService, private classSessionService: ClassSessionService) {}

ngOnInit(): void {
    this.paymentMensual();
    this.classMonth();
    this.loadBirthdays();
    this.loadClientsEndingSoon();
    this.getNewClients();
    this.loadCurrentMonthStats();
    this.loadNumberWorkers();
    this.loadInactiveClientsCount();
  }


  loadInactiveClientsCount(): void {
    this.clientService.getInactiveClients().subscribe({
      next: (clients) => {
        this.inactiveClients = clients;
        this.inactiveClientsCount = clients.length; // así mantenemos sincronizado
      },
      error: (err) => console.error(err)
    });
  }

  openInactiveModal(): void {
    this.showInactiveModal = true;
  }


  closeInactiveModal(): void {
    this.showInactiveModal = false;
  }

  loadNumberWorkers(){
    this.workersService.getNonAdminClientUsersCount().subscribe({
    next: (res) => {
      this.workers = res.workers;
    },
    error: (err) => console.error(err)
  });
  }


  loadCurrentMonthStats() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; 
    const currentYear = today.getFullYear();

    this.clientService.getClientRegistrationsStats().subscribe({
      next: (stats) => {
        // buscar stats del mes actual
        const currentStats = stats.find(
          (s: any) => s.month === currentMonth && s.year === currentYear
        );
        this.currentMonthClients = currentStats ? currentStats.totalClients : 0;
      },
      error: (err) => console.error(err)
    });
  }

  getNewClients(): void{
    this.clientService.getClientsRegistered().subscribe({
      next: (data) => {
        this.newClients = data;
      },
      error: (err) => console.error(err)
    });
  }

  loadBirthdays(): void {
    this.clientService.getClientsWithBirthdayInNextWeek().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (err) => {
        console.error('Error cargando cumpleaños', err);
      }
    });
  }

  formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}`; 
}

loadClientsEndingSoon(): void {
    this.clientService.getClientsEndingSoon().subscribe({
      next: (data) => this.clientsEnding = data,
      error: (err) => console.error(err)
    });
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
