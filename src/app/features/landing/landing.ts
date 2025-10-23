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
      text: "Me siento feliz en las clases, súper personalizada y sobretodo la instructora cuenta con el conocimiento de cada movimiento en el cuerpo de cada persona.",
      name: "Cliente",
      role: ""
    },
    {
      text: "Mi experiencia con pilates ha sido muy positiva. Me ha ayudado a conocer mejor mi cuerpo, mejorar mi postura y reducir el estrés. Es un momento que dedico solo para mí, donde conecto mente y cuerpo.",
      name: "Cliente",
      role: ""
    },
    {
      text: "Nati es una instructora muy atenta, nos mantiene motivada y siempre realiza ejercicios muy variados. Tiene mucha paciencia y ha sabido adaptar los ejercicios a mi lesión de muñeca. Muy feliz con las clases.",
      name: "Cliente",
      role: ""
    },
    {
      text: "Las clases de pilates me encantan. Me siento más fuerte, relajada y motivada después de cada sesión. El ambiente es muy acogedor, Nati y Mara son muy profesionales y amables.",
      name: "Cliente",
      role: ""
    },
    {
      text: "Amo el ambiente relajado y sereno. La atención de Nati, súper amable y personalizada. Siempre salgo sintiéndome con energía y en calma.",
      name: "Cliente",
      role: ""
    },
    {
      text: "El mejor studio boutique de pilates en Trujillo.",
      name: "Cliente",
      role: ""
    },
    {
      text: "Es totalmente reconfortante, física y emocionalmente.",
      name: "Cliente",
      role: ""
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
