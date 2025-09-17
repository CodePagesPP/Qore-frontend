import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlanService } from '../../core/services/plan.service';
import { PlanResponse } from '../../core/models/plan.model';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-landing',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {

  constructor(private planService: PlanService) {}

  plans: PlanResponse[] = [];
  testimonials = [
    {
      text: "Both the coordinators and the aids are professional and caring. They help me navigate my daily needs and give me what I need to live my life to the fullest.",
      name: "Chris Hemsworth",
      role: "Cliente | 1 año practicando pilates"
    },
    {
      text: "This program changed my life! The trainers and resources gave me confidence and motivation to keep improving every day.",
      name: "Emily Johnson",
      role: "Manager | Health Co."
    },
    {
      text: "Amazing support and excellent guidance! I feel more productive, healthier, and happier since I joined their programs.",
      name: "Robert Smith",
      role: "CEO | FitLife Inc."
    }
  ];

  currentIndex = 0;
  interval: any;

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  ngOnInit(): void {
    this.loadPlans();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  faqs = [
    {
      question: "¿Qué tipo de clases ofrecen?",
      answer: "En Qore Wellness Lab dictamos clases de Pilates Mat, Spine Corrector, Reformer, Fitball y accesorios. Además, contamos con clases privadas en Cadillac y en cualquiera de los equipos.",
      open: false
    },
    {
      question: "¿Ofrecen clases de prueba?",
      answer: "No. En lugar de ello, todos los alumnos inician con una clase de evaluación personalizada, indispensable para recomendar el plan adecuado.",
      open: false
    },
    {
      question: "¿Necesito experiencia previa para empezar?",
      answer: "No. Todos los alumnos inician con una clase de evaluación, donde explicamos los principios de Pilates, evaluamos postura, pisada y desenvolvimiento. A partir de ahí diseñamos el plan más adecuado para ti.",
      open: false
    },
    {
      question: "¿Dónde están ubicados?",
      answer: "Qore Wellness Lab está la Urbanización California en Trujillo, en una zona segura y tranquila, con estacionamiento disponible afuera (espacios limitados) y en calles cercanas.",
      open: false
    }
  ];

  toggleFaq(index: number) {
  this.faqs.forEach((faq, i) => {
    faq.open = i === index ? !faq.open : false;
  });
}

loadPlans() {
    this.planService.getAllPlans().subscribe({
      next: (data) => this.plans = data.filter(p => p.active),
      error: (err) => console.error('Error loading plans', err)
    });
  }
}
