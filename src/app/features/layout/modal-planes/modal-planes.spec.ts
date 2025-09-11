import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPlanes } from './modal-planes';

describe('ModalPlanes', () => {
  let component: ModalPlanes;
  let fixture: ComponentFixture<ModalPlanes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPlanes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPlanes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
