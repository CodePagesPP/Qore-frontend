import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasesClient } from './clases-client';

describe('ClasesClient', () => {
  let component: ClasesClient;
  let fixture: ComponentFixture<ClasesClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClasesClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClasesClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
