import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldBondFormComponent } from './gold-bond-form.component';

describe('GoldBondFormComponent', () => {
  let component: GoldBondFormComponent;
  let fixture: ComponentFixture<GoldBondFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoldBondFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoldBondFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
