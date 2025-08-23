import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Disciplines } from './disciplines';

describe('Disciplines', () => {
  let component: Disciplines;
  let fixture: ComponentFixture<Disciplines>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Disciplines]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Disciplines);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
