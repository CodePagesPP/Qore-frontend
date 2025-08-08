import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudClients } from './crud-clients';

describe('CrudClients', () => {
  let component: CrudClients;
  let fixture: ComponentFixture<CrudClients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudClients]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudClients);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
