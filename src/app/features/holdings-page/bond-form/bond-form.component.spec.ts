import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BondFormComponent } from './bond-form.component';

describe('BondFormComponent', () => {
  let component: BondFormComponent;
  let fixture: ComponentFixture<BondFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BondFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BondFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
