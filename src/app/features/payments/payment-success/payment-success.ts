import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  imports: [],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.css'
})
export class PaymentSuccess implements OnInit{
constructor(private router: Router) {}

  ngOnInit(): void {
    // Redirige automáticamente después de 3 segundos
    setTimeout(() => {
      this.router.navigate(['/c/dashboard']);
    }, 3000);
  }
}
