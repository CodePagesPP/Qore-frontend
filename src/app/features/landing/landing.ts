import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  testimonials = [
    {
      text: "Both the coordinators and the aids are professional and caring. They help me navigate my daily needs and give me what I need to live my life to the fullest.",
      name: "Chris Hemsworth",
      role: "Leader | Asgard Solutions"
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

 

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  faqs = [
    {
      question: "What is YogaPlus?",
      answer: "YogaPlus is a comprehensive platform that offers online yoga classes, tutorials, and resources for all levels of practice.",
      open: false
    },
    {
      question: "What is Cardio Strength?",
      answer: "Cardio Strength combines endurance exercises with strength training to improve stamina and build muscle simultaneously.",
      open: false
    },
    {
      question: "About Training Video Curriculum?",
      answer: "Our training video curriculum includes beginner to advanced yoga sessions, covering flexibility, mindfulness, and fitness goals.",
      open: false
    },
    {
      question: "Why YogaPlus?",
      answer: "YogaPlus is designed to make yoga accessible for everyone, anytime and anywhere, with expert teachers and flexible schedules.",
      open: false
    }
  ];

  toggleFaq(index: number) {
  this.faqs.forEach((faq, i) => {
    faq.open = i === index ? !faq.open : false;
  });
}
}
