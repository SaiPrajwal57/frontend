import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentModalComponent } from './investment-modal.component';

describe('InvestmentModalComponent', () => {
  let component: InvestmentModalComponent;
  let fixture: ComponentFixture<InvestmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestmentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
