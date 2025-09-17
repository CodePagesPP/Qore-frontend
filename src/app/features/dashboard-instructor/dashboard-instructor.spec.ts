import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardInstructor } from './dashboard-instructor';

describe('DashboardInstructor', () => {
  let component: DashboardInstructor;
  let fixture: ComponentFixture<DashboardInstructor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardInstructor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardInstructor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
