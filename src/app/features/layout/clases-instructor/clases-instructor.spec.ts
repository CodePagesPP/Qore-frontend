import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasesInstructor } from './clases-instructor';

describe('ClasesInstructor', () => {
  let component: ClasesInstructor;
  let fixture: ComponentFixture<ClasesInstructor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClasesInstructor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClasesInstructor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
