import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlanService } from '../../core/services/plan.service';
import { PlanResponse } from '../../core/models/plan.model';
import { FormsModule } from "@angular/forms";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

interface FaqItem {
  QUESTION: string;
  ANSWER: string;
  open?: boolean;
}
@Component({
  selector: 'app-landing',
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  currentLang = 'es';
  currentFlag = 'assets/es.svg'
  faqs: FaqItem[] = [];
  faqsOpen: boolean[] = [];
  faqSub!: Subscription;
  constructor(private planService: PlanService, private translate: TranslateService) {
    this.translate.setDefaultLang(this.currentLang);
    this.translate.use(this.currentLang); 
  }

  toggleLanguage() {
    if (this.currentLang === 'es') {
      this.currentLang = 'en';
      this.currentFlag = 'assets/en.svg';
    } else {
      this.currentLang = 'es';
      this.currentFlag = 'assets/es.svg';
    }
    this.translate.use(this.currentLang);
  }

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
    this.faqSub = this.translate.stream('FAQ.ITEMS').subscribe((items: FaqItem[]) => {
      this.faqs = items.map(item => ({ ...item, open: false }));
      this.faqsOpen = new Array(items.length).fill(false);
    });
  }

  toggleFaq(index: number) {
    this.faqsOpen[index] = !this.faqsOpen[index];
  }

  ngOnDestroy(): void {
    this.faqSub?.unsubscribe();
  }

loadPlans() {
    this.planService.getAllPlans().subscribe({
      next: (data) => this.plans = data.filter(p => p.active),
      error: (err) => console.error('Error loading plans', err)
    });
  }
}
