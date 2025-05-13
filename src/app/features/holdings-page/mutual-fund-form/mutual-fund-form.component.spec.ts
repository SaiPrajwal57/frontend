import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MutualFundFormComponent } from './mutual-fund-form.component';

describe('MutualFundFormComponent', () => {
  let component: MutualFundFormComponent;
  let fixture: ComponentFixture<MutualFundFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MutualFundFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MutualFundFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
