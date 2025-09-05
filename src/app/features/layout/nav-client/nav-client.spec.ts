import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavClient } from './nav-client';

describe('NavClient', () => {
  let component: NavClient;
  let fixture: ComponentFixture<NavClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
