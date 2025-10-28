import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-pending',
  imports: [],
  templateUrl: './payment-pending.html',
  styleUrl: './payment-pending.css'
})
export class PaymentPending implements OnInit{
constructor(private router: Router) {}

  ngOnInit(): void {
    // Redirige automáticamente después de 5 segundos (más largo por revisión)
    setTimeout(() => {
      this.router.navigate(['/c/dashboard']);
    }, 5000);
  }
}
