import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavInstructor } from './nav-instructor';

describe('NavInstructor', () => {
  let component: NavInstructor;
  let fixture: ComponentFixture<NavInstructor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavInstructor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavInstructor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
