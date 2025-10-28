import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-failure',
  imports: [],
  templateUrl: './payment-failure.html',
  styleUrl: './payment-failure.css'
})
export class PaymentFailure implements OnInit{
constructor(private router: Router) {}

  ngOnInit(): void {
    
    setTimeout(() => {
      this.router.navigate(['/c/dashboard']);
    }, 5000);
  }
}
