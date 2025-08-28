import { Component } from '@angular/core';
import { PlanService } from '../../../core/services/plan.service';
import { DisciplineService } from '../../../core/services/discipline.service';
import { PlanCreate, PlanResponse } from '../../../core/models/plan.model';
import { Discipline } from '../../../core/models/auth.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-plans',
  imports: [CommonModule, FormsModule],
  templateUrl: './plans.html',
  styleUrl: './plans.css'
})
export class Plans {
  plans: PlanResponse[] = [];
  disciplines: Discipline[] = [];

  
  isModalOpen = false;
  isEdit = false;
  currentPlan: PlanCreate = {
    name: '',
    discipline_id: [],
    description: '',
    sessions: 0,
    payMethod: '',
    duration: 0,
    price: 0,
    sellType: '',
    active: true,
    reprograms: 0
  };

  constructor(private planService: PlanService, private disciplineService: DisciplineService) {}

  ngOnInit(): void {
    this.loadPlans();
    this.loadDisciplines();
  }

  loadPlans() {
    this.planService.getAllPlans().subscribe(ps => this.plans = ps);
  }

  loadDisciplines() {
    this.disciplineService.getAll().subscribe(ds => this.disciplines = ds);
  }

  getDisciplineName(id: number): string {
  return this.disciplines.find(dd => dd.id === id)?.name || '';
}

  openModal(plan?: PlanResponse) {
    this.isModalOpen = true;
    this.isEdit = !!plan;
    if (plan) {
      this.currentPlan = {
        name: plan.name,
        discipline_id: [...plan.discipline_id],
        description: plan.description,
        sessions: plan.sessions,
        payMethod: plan.payMethod,
        duration: plan.duration,
        price: plan.price,
        sellType: plan.sellType,
        active: plan.active,
        reprograms: plan.reprograms
      };
    } else {
      this.currentPlan = {
        name: '',
        discipline_id: [],
        description: '',
        sessions: 0,
        payMethod: '',
        duration: 0,
        price: 0,
        sellType: '',
        active: true,
        reprograms: 0
      };
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  toggleDiscipline(id: number) {
    if (this.currentPlan.discipline_id.includes(id)) {
      this.currentPlan.discipline_id = this.currentPlan.discipline_id.filter(d => d !== id);
    } else {
      this.currentPlan.discipline_id.push(id);
    }
  }

  savePlan() {
    if (this.isEdit && (this.plans.find(p => p.name === this.currentPlan.name)?.id)) {
      const id = this.plans.find(p => p.name === this.currentPlan.name)?.id!;
      this.planService.updatePlan(id, this.currentPlan).subscribe(() => {
        this.loadPlans();
        this.closeModal();
      });
    } else {
      this.planService.createPlan(this.currentPlan).subscribe(() => {
        this.loadPlans();
        this.closeModal();
      });
    }
  }

  deletePlan(id: number) {
    if (confirm('¿Seguro que deseas eliminar este plan?')) {
      this.planService.deletePlan(id).subscribe(() => this.loadPlans());
    }
  }
}
